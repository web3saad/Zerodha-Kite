import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Default data matching the Orders component
const defaultOpenOrders = [
    { id: 1, t: "13:39:12", type: 'sell', inst: "PNB", ex: "NSE", prod: "CO", qty: "0 / 1", ltp: "49.30", price: "0.00 / 48.50 trg.", status: 'open' },
    { id: 2, t: "13:39:12", type: 'buy', inst: "INFY", ex: "NSE", prod: "CO", qty: "0 / 1", ltp: "49.30", price: "49.50 / 48.50 trg.", status: 'open' },
    { id: 3, t: "13:35:15", type: 'buy', inst: "USDINR 23MAY FUT", ex: "CDS", prod: "NRML", qty: "0 / 3", ltp: "82.4225", price: "81.0000", status: 'open' },
    { id: 4, t: "13:34:15", type: 'buy', inst: "USDINR 23MAY FUT", ex: "CDS", prod: "MIS", qty: "0 / 1", ltp: "82.4225", price: "81.0000", status: 'open' },
    { id: 5, t: "13:32:12", type: 'buy', inst: "SBIN", ex: "BSE", prod: "MIS", qty: "0 / 1", ltp: "586.50", price: "585.00 / 585.00 trg.", status: 'open' },
    { id: 6, t: "13:29:52", type: 'buy', inst: "VEDL", ex: "NSE", prod: "CNC", qty: "0 / 1", ltp: "279.45", price: "0.00 / 290.00 trg.", status: 'open' },
  ];

  const defaultExecutedOrders = [
    { id: 7, t: "13:45:09", type: 'buy', inst: "11th 23MAY 18300 CE", ex: "NFO", prod: "MIS", qty: "0 / 50", avg: "0.00", status: 'rejected' },
    { id: 8, t: "13:44:50", type: 'buy', inst: "11th 23MAY 18300 CE", ex: "NRML", prod: "MIS", qty: "0 / 50", avg: "0.00", status: 'rejected' },
    { id: 9, t: "13:39:08", type: 'sell', inst: "PNB", ex: "NSE", prod: "CNC", qty: "0 / 1", avg: "51.20", status: 'cancelled' },
    { id: 10, t: "13:37:34", type: 'buy', inst: "INFY", ex: "NSE", prod: "CNC", qty: "1 / 1", avg: "50.75", status: 'complete' },
    { id: 11, t: "13:28:52", type: 'buy', inst: "VEDL", ex: "NSE", prod: "MIS", qty: "1 / 1", avg: "283.40", status: 'complete' },
  ];

const OrdersPageManager = () => {
  const [openOrders, setOpenOrders] = useState([]);
  const [executedOrders, setExecutedOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [orderType, setOrderType] = useState('open'); // 'open' or 'executed'
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    t: '',
    type: 'buy',
    inst: '',
    ex: 'NSE',
    prod: 'CNC',
    qty: '0 / 1',
    ltp: '0.00',
    price: '0.00',
    avg: '0.00',
    status: 'open'
  });

  useEffect(() => {
    const loadOrdersData = async () => {
    try {
      setLoading(true);
      // Try to load from backend, fallback to default data
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/admin/orders-page', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data) {
          setOpenOrders(response.data.openOrders || defaultOpenOrders);
          setExecutedOrders(response.data.executedOrders || defaultExecutedOrders);
        } else {
          setOpenOrders(defaultOpenOrders);
          setExecutedOrders(defaultExecutedOrders);
        }
      } catch (error) {
        console.error('Error loading from API, using default data:', error);
        setOpenOrders(defaultOpenOrders);
        setExecutedOrders(defaultExecutedOrders);
      }
    } finally {
      setLoading(false);
    }
    };

    loadOrdersData();
  }, []);

  const handleAddOrder = (type) => {
    setOrderType(type);
    setFormData({
      t: new Date().toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'buy',
      inst: '',
      ex: 'NSE',
      prod: type === 'open' ? 'CNC' : 'MIS',
      qty: '0 / 1',
      ltp: '0.00',
      price: '0.00',
      avg: '0.00',
      status: type === 'open' ? 'open' : 'complete'
    });
    setEditingOrder(null);
    setShowAddModal(true);
  };

  const handleEditOrder = (order) => {
    setFormData(order);
    setEditingOrder(order);
    setOrderType(order.status === 'open' ? 'open' : 'executed');
    setShowAddModal(true);
  };

  const handleDeleteOrder = (order) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      const orderId = order.id;
      setOpenOrders(openOrders.filter(o => o.id !== orderId));
      setExecutedOrders(executedOrders.filter(o => o.id !== orderId));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingOrder) {
        // Update existing order
        if (orderType === 'open') {
          const updatedOrders = openOrders.map(order => 
            order.id === editingOrder.id ? { ...formData, id: editingOrder.id } : order
          );
          setOpenOrders(updatedOrders);
        } else {
          const updatedOrders = executedOrders.map(order => 
            order.id === editingOrder.id ? { ...formData, id: editingOrder.id } : order
          );
          setExecutedOrders(updatedOrders);
        }
        
        // Try to save to backend
        try {
          await axios.put(`http://localhost:3000/api/admin/orders-page`, {
            openOrders: orderType === 'open' ? 
              openOrders.map(o => o.id === editingOrder.id ? { ...formData, id: editingOrder.id } : o) : 
              openOrders,
            executedOrders: orderType === 'executed' ? 
              executedOrders.map(o => o.id === editingOrder.id ? { ...formData, id: editingOrder.id } : o) : 
              executedOrders
          }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
          console.error('Error saving to backend:', error);
        }
        
        alert('Order updated successfully!');
      } else {
        // Add new order
        const newOrder = {
          ...formData,
          id: Math.max(...[...openOrders, ...executedOrders].map(o => o.id), 0) + 1
        };
        
        if (orderType === 'open') {
          const newOpenOrders = [...openOrders, newOrder];
          setOpenOrders(newOpenOrders);
          
          // Try to save to backend
          try {
            await axios.put(`http://localhost:3000/api/admin/orders-page`, {
              openOrders: newOpenOrders,
              executedOrders
            }, { headers: { Authorization: `Bearer ${token}` } });
          } catch (error) {
            console.error('Error saving to backend:', error);
          }
        } else {
          const newExecutedOrders = [...executedOrders, newOrder];
          setExecutedOrders(newExecutedOrders);
          
          // Try to save to backend
          try {
            await axios.put(`http://localhost:3000/api/admin/orders-page`, {
              openOrders,
              executedOrders: newExecutedOrders
            }, { headers: { Authorization: `Bearer ${token}` } });
          } catch (error) {
            console.error('Error saving to backend:', error);
          }
        }
        
        alert('Order added successfully!');
      }
      setShowAddModal(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Error saving order');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return { bg: 'rgba(40,167,69,0.12)', color: '#28a745' };
      case 'open': return { bg: '#f2f4f7', color: '#6f7680' };
      case 'cancelled': return { bg: '#f2f4f7', color: '#8a939d' };
      case 'rejected': return { bg: '#ffecee', color: '#e26a6a' };
      default: return { bg: '#f2f4f7', color: '#6f7680' };
    }
  };

  const getTypeColor = (type) => {
    return type === 'buy' 
      ? { bg: '#eef3ff', color: '#5b7cff' }
      : { bg: '#ffeef0', color: '#ff6a6a' };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        Loading orders page data...
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: '20px', 
          fontWeight: '500', 
          color: '#333',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          📋 Orders Page Content Manager
        </h2>
        <p style={{ 
          margin: '4px 0 0', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          Manage the orders that appear on the main Orders page in the dashboard
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          background: '#fff3cd', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#b8860b' }}>
            {openOrders.length}
          </div>
          <div style={{ fontSize: '14px', color: '#b8860b', marginTop: '4px' }}>
            Open Orders
          </div>
        </div>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>
            {executedOrders.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            Executed Orders
          </div>
        </div>
        <div style={{ 
          background: '#eaf8ed', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#2fb344' }}>
            {executedOrders.filter(o => o.status === 'complete').length}
          </div>
          <div style={{ fontSize: '14px', color: '#2fb344', marginTop: '4px' }}>
            Completed
          </div>
        </div>
        <div style={{ 
          background: '#f8d7da', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#721c24' }}>
            {executedOrders.filter(o => o.status === 'rejected' || o.status === 'cancelled').length}
          </div>
          <div style={{ fontSize: '14px', color: '#721c24', marginTop: '4px' }}>
            Rejected/Cancelled
          </div>
        </div>
      </div>

      {/* Open Orders Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#333' }}>
            Open Orders ({openOrders.length})
          </h3>
          <button
            onClick={() => handleAddOrder('open')}
            style={{
              background: '#387ef5',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + Add Open Order
          </button>
        </div>

        <div style={{ 
          background: '#fff',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Time</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Instrument</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Exchange</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>LTP</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {openOrders.map((order, index) => {
                const statusStyle = getStatusColor(order.status);
                const typeStyle = getTypeColor(order.type);
                
                return (
                  <tr 
                    key={order.id} 
                    style={{ 
                      borderBottom: '1px solid #e9ecef',
                      background: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{order.t}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{order.inst}</td>
                    <td style={{ padding: '12px' }}>{order.ex}</td>
                    <td style={{ padding: '12px' }}>{order.prod}</td>
                    <td style={{ padding: '12px' }}>{order.qty}</td>
                    <td style={{ padding: '12px' }}>{order.ltp}</td>
                    <td style={{ padding: '12px' }}>{order.price}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditOrder(order)}
                          style={{
                            background: '#387ef5',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executed Orders Section */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '16px' 
        }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500', color: '#333' }}>
            Executed Orders ({executedOrders.length})
          </h3>
          <button
            onClick={() => handleAddOrder('executed')}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            + Add Executed Order
          </button>
        </div>

        <div style={{ 
          background: '#fff',
          border: '1px solid #e9ecef',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse',
            fontSize: '13px'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Time</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Instrument</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Exchange</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Avg Price</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {executedOrders.map((order, index) => {
                const statusStyle = getStatusColor(order.status);
                const typeStyle = getTypeColor(order.type);
                
                return (
                  <tr 
                    key={order.id} 
                    style={{ 
                      borderBottom: '1px solid #e9ecef',
                      background: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}
                  >
                    <td style={{ padding: '12px' }}>{order.t}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{order.inst}</td>
                    <td style={{ padding: '12px' }}>{order.ex}</td>
                    <td style={{ padding: '12px' }}>{order.prod}</td>
                    <td style={{ padding: '12px' }}>{order.qty}</td>
                    <td style={{ padding: '12px' }}>{order.avg}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditOrder(order)}
                          style={{
                            background: '#387ef5',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order)}
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: '600' }}>
              {editingOrder ? 'Edit Order' : `Add New ${orderType === 'open' ? 'Open' : 'Executed'} Order`}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Time
                  </label>
                  <input
                    type="text"
                    value={formData.t}
                    onChange={(e) => setFormData({...formData, t: e.target.value})}
                    required
                    placeholder="13:39:12"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="buy">BUY</option>
                    <option value="sell">SELL</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Instrument
                  </label>
                  <input
                    type="text"
                    value={formData.inst}
                    onChange={(e) => setFormData({...formData, inst: e.target.value})}
                    required
                    placeholder="e.g., HDFCBANK, NIFTY 50, USDINR 23MAY FUT"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Exchange
                  </label>
                  <select
                    value={formData.ex}
                    onChange={(e) => setFormData({...formData, ex: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="NSE">NSE</option>
                    <option value="BSE">BSE</option>
                    <option value="NFO">NFO</option>
                    <option value="BFO">BFO</option>
                    <option value="CDS">CDS</option>
                    <option value="NRML">NRML</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Product
                  </label>
                  <select
                    value={formData.prod}
                    onChange={(e) => setFormData({...formData, prod: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="CNC">CNC</option>
                    <option value="MIS">MIS</option>
                    <option value="NRML">NRML</option>
                    <option value="CO">CO</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: e.target.value})}
                    required
                    placeholder="0 / 1"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    LTP
                  </label>
                  <input
                    type="text"
                    value={formData.ltp}
                    onChange={(e) => setFormData({...formData, ltp: e.target.value})}
                    placeholder="49.30"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    {orderType === 'open' ? 'Price' : 'Avg Price'}
                  </label>
                  <input
                    type="text"
                    value={orderType === 'open' ? formData.price : formData.avg}
                    onChange={(e) => setFormData({
                      ...formData, 
                      [orderType === 'open' ? 'price' : 'avg']: e.target.value
                    })}
                    placeholder={orderType === 'open' ? "0.00 / 48.50 trg." : "50.75"}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    {orderType === 'open' ? (
                      <option value="open">OPEN</option>
                    ) : (
                      <>
                        <option value="complete">COMPLETE</option>
                        <option value="cancelled">CANCELLED</option>
                        <option value="rejected">REJECTED</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'flex-end',
                marginTop: '24px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#387ef5',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {editingOrder ? 'Update Order' : 'Add Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPageManager;