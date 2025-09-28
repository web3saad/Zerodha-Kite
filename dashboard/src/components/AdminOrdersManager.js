import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Mock orders data - you can replace this with actual API calls
const mockOrders = [
    {
      id: 1,
      instrument: 'HDFCBANK',
      qty: 10,
      price: 1450.50,
      orderType: 'BUY',
      status: 'COMPLETE',
      exchange: 'NSE',
      product: 'MIS',
      validity: 'DAY',
      time: '2025-09-28 09:15:30',
      triggerPrice: 0,
      disclosedQty: 0,
      tag: 'web',
      avgPrice: 1450.45,
      filledQty: 10,
      pendingQty: 0
    },
    {
      id: 2,
      instrument: 'INFY',
      qty: 5,
      price: 1555.25,
      orderType: 'SELL',
      status: 'OPEN',
      exchange: 'NSE',
      product: 'CNC',
      validity: 'DAY',
      time: '2025-09-28 10:30:15',
      triggerPrice: 0,
      disclosedQty: 0,
      tag: 'web',
      avgPrice: 0,
      filledQty: 0,
      pendingQty: 5
    },
    {
      id: 3,
      instrument: 'TCS',
      qty: 8,
      price: 3890.75,
      orderType: 'BUY',
      status: 'CANCELLED',
      exchange: 'NSE',
      product: 'MIS',
      validity: 'DAY',
      time: '2025-09-28 11:45:20',
      triggerPrice: 0,
      disclosedQty: 0,
      tag: 'api',
      avgPrice: 0,
      filledQty: 0,
      pendingQty: 0
    }
  ];

const AdminOrdersManager = () => {
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    instrument: '',
    qty: 1,
    price: 0,
    orderType: 'BUY',
    status: 'OPEN',
    exchange: 'NSE',
    product: 'MIS',
    validity: 'DAY',
    triggerPrice: 0,
    disclosedQty: 0,
    tag: ''
  });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/admin/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.length > 0) {
          setOrders(response.data);
        } else {
          // If no orders from API, use mock data for demo
          setOrders(mockOrders);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading orders:', error);
        // Fall back to mock data for demo purposes
        setOrders(mockOrders);
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const handleAddOrder = () => {
    setFormData({
      instrument: '',
      qty: 1,
      price: 0,
      orderType: 'BUY',
      status: 'OPEN',
      exchange: 'NSE',
      product: 'MIS',
      validity: 'DAY',
      triggerPrice: 0,
      disclosedQty: 0,
      tag: 'admin'
    });
    setEditingOrder(null);
    setShowAddModal(true);
  };

  const handleEditOrder = (order) => {
    setFormData({
      instrument: order.instrument,
      qty: order.qty,
      price: order.price,
      orderType: order.orderType,
      status: order.status,
      exchange: order.exchange,
      product: order.product,
      validity: order.validity,
      triggerPrice: order.triggerPrice || 0,
      disclosedQty: order.disclosedQty || 0,
      tag: order.tag || 'admin'
    });
    setEditingOrder(order);
    setShowAddModal(true);
  };

  const handleDeleteOrder = async (order) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        const orderId = order._id || order.id;
        
        await axios.delete(
          `${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/admin/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrders(orders.filter(o => (o._id || o.id) !== orderId));
        alert('Order deleted successfully!');
      } catch (error) {
        console.error('Error deleting order:', error);
        // Fall back to local deletion for demo
        const orderId = order._id || order.id;
        setOrders(orders.filter(o => (o._id || o.id) !== orderId));
        alert('Order deleted successfully! (Local mode)');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (editingOrder) {
        // Update existing order
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/admin/orders/${editingOrder._id || editingOrder.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const updatedOrders = orders.map(order => 
          (order._id || order.id) === (editingOrder._id || editingOrder.id)
            ? response.data
            : order
        );
        setOrders(updatedOrders);
        alert('Order updated successfully!');
      } else {
        // Add new order
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/admin/orders`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setOrders([...orders, response.data]);
        alert('Order added successfully!');
      }
      setShowAddModal(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving order:', error);
      // Fall back to local state update for demo
      if (editingOrder) {
        const updatedOrders = orders.map(order => 
          (order._id || order.id) === (editingOrder._id || editingOrder.id)
            ? { 
                ...order, 
                ...formData,
                time: order.time // Keep original time
              }
            : order
        );
        setOrders(updatedOrders);
        alert('Order updated successfully! (Local mode)');
      } else {
        const newOrder = {
          id: Math.max(...orders.map(o => o.id || o._id), 0) + 1,
          ...formData,
          time: new Date().toLocaleString('sv-SE').replace('T', ' '),
          avgPrice: formData.status === 'COMPLETE' ? formData.price : 0,
          filledQty: formData.status === 'COMPLETE' ? formData.qty : 0,
          pendingQty: formData.status === 'COMPLETE' ? 0 : formData.qty
        };
        setOrders([...orders, newOrder]);
        alert('Order added successfully! (Local mode)');
      }
      setShowAddModal(false);
      setEditingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETE': return { bg: '#eaf8ed', color: '#2fb344' };
      case 'OPEN': return { bg: '#f2f4f7', color: '#6f7680' };
      case 'CANCELLED': return { bg: '#f2f4f7', color: '#8a939d' };
      case 'REJECTED': return { bg: '#ffecee', color: '#e26a6a' };
      default: return { bg: '#f2f4f7', color: '#6f7680' };
    }
  };

  const getOrderTypeColor = (type) => {
    return type === 'BUY' 
      ? { bg: '#eef3ff', color: '#5b7cff' }
      : { bg: '#ffeef0', color: '#ff6a6a' };
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div>
          <h2 style={{ 
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '500', 
            color: '#333',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            📋 Orders Management
          </h2>
          <p style={{ 
            margin: '4px 0 0', 
            color: '#666', 
            fontSize: '14px' 
          }}>
            Manage and edit orders displayed in the dashboard
          </p>
        </div>
        <button
          onClick={handleAddOrder}
          style={{
            background: '#387ef5',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          + Add New Order
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          background: '#f8f9fa', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#333' }}>
            {orders.length}
          </div>
          <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            Total Orders
          </div>
        </div>
        <div style={{ 
          background: '#eaf8ed', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #c3e6cb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#2fb344' }}>
            {orders.filter(o => o.status === 'COMPLETE').length}
          </div>
          <div style={{ fontSize: '14px', color: '#2fb344', marginTop: '4px' }}>
            Completed
          </div>
        </div>
        <div style={{ 
          background: '#fff3cd', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #ffeaa7'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#b8860b' }}>
            {orders.filter(o => o.status === 'OPEN').length}
          </div>
          <div style={{ fontSize: '14px', color: '#b8860b', marginTop: '4px' }}>
            Open Orders
          </div>
        </div>
        <div style={{ 
          background: '#f8d7da', 
          padding: '16px', 
          borderRadius: '8px',
          border: '1px solid #f5c6cb'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '600', color: '#721c24' }}>
            {orders.filter(o => o.status === 'CANCELLED' || o.status === 'REJECTED').length}
          </div>
          <div style={{ fontSize: '14px', color: '#721c24', marginTop: '4px' }}>
            Cancelled/Rejected
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666' 
        }}>
          Loading orders...
        </div>
      ) : (
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
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Instrument</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Qty</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Price</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Product</th>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '500', color: '#495057' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => {
                const statusStyle = getStatusColor(order.status);
                const typeStyle = getOrderTypeColor(order.orderType);
                
                return (
                  <tr 
                    key={order._id || order.id} 
                    style={{ 
                      borderBottom: '1px solid #e9ecef',
                      background: index % 2 === 0 ? '#fff' : '#f8f9fa'
                    }}
                  >
                    <td style={{ padding: '12px' }}>
                      {order.time}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '500' }}>
                      {order.instrument}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {order.qty}
                    </td>
                    <td style={{ padding: '12px' }}>
                      ₹{order.price.toFixed(2)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: typeStyle.bg,
                        color: typeStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.orderType}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {order.product}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditOrder(order)}
                          style={{
                            background: '#387ef5',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
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
                            padding: '6px 12px',
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
      )}

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
              {editingOrder ? 'Edit Order' : 'Add New Order'}
            </h3>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Instrument
                  </label>
                  <input
                    type="text"
                    value={formData.instrument}
                    onChange={(e) => setFormData({...formData, instrument: e.target.value})}
                    required
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
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value)})}
                    required
                    min="1"
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
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    required
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
                    Order Type
                  </label>
                  <select
                    value={formData.orderType}
                    onChange={(e) => setFormData({...formData, orderType: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="BUY">BUY</option>
                    <option value="SELL">SELL</option>
                  </select>
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
                    <option value="OPEN">OPEN</option>
                    <option value="COMPLETE">COMPLETE</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="REJECTED">REJECTED</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Product
                  </label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({...formData, product: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="MIS">MIS (Intraday)</option>
                    <option value="CNC">CNC (Delivery)</option>
                    <option value="NRML">NRML (Normal)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Exchange
                  </label>
                  <select
                    value={formData.exchange}
                    onChange={(e) => setFormData({...formData, exchange: e.target.value})}
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
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                    Tag
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({...formData, tag: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e9ecef',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
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

export default AdminOrdersManager;