import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const TradingModal = ({ 
  stock, 
  side = 'buy', // 'buy' or 'sell'
  isOpen, 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState('Regular');
  const [productType, setProductType] = useState('Overnight');
  const [orderType, setOrderType] = useState('Market');
  const [qty, setQty] = useState(1);
  const [marketPrice, setMarketPrice] = useState(0);
  const [triggerPrice, setTriggerPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stock?.ltp) {
      const stockPrice = typeof stock.ltp === 'string' 
        ? parseFloat(stock.ltp.replace(/[₹,]/g, '')) 
        : parseFloat(stock.ltp);
      setMarketPrice(stockPrice || 0);
    }
  }, [stock]);

  if (!isOpen || !stock) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        stock: {
          symbol: stock.symbol || stock.name,
          name: stock.name || stock.symbol,
          price: marketPrice.toString()
        },
        orderType: side.toUpperCase(),
        quantity: qty,
        price: marketPrice,
        exchange: 'BSE'
      };

      // Only add to positions if it's a BUY order
      if (side === 'buy') {
        const response = await fetch(`${API_BASE_URL}/positions/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * marketPrice).toFixed(2)}\\n\\nPosition added to your portfolio!`);
        } else {
          alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * marketPrice).toFixed(2)}\\n\\nNote: Failed to add to positions.`);
        }
      } else {
        // For SELL orders, just show success message
        alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * marketPrice).toFixed(2)}`);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Error placing ${side.toUpperCase()} order. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    fontFamily: 'Inter, sans-serif'
  };

  const modalStyle = {
    backgroundColor: '#fff',
    borderRadius: '12px',
    width: '480px',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    position: 'relative'
  };

  const headerStyle = {
    backgroundColor: side === 'buy' ? '#5570F1' : '#e26a6a',
    color: '#fff',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '16px',
    fontWeight: '500'
  };

  const subtitleStyle = {
    margin: 0,
    fontSize: '12px',
    opacity: 0.8,
    marginTop: '2px'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    fontSize: '20px',
    lineHeight: 1,
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f9fafb'
  };

  const tabStyle = (active) => ({
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    backgroundColor: active ? '#fff' : 'transparent',
    color: active ? '#5570F1' : '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: active ? '500' : '400',
    borderBottom: active ? '2px solid #5570F1' : 'none'
  });

  const contentStyle = {
    padding: '24px'
  };

  const radioGroupStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px'
  };

  const radioOptionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer'
  };

  const inputRowStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'flex-end'
  };

  const inputGroupStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '16px',
    color: '#111827'
  };

  const orderTypeGroupStyle = {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px'
  };

  const footerStyle = {
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb'
  };

  const marginChargesStyle = {
    fontSize: '12px',
    color: '#6b7280'
  };

  const buttonGroupStyle = {
    display: 'flex',
    gap: '12px'
  };

  const buyButtonStyle = {
    backgroundColor: '#5570F1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    minWidth: '80px'
  };

  const cancelButtonStyle = {
    backgroundColor: '#fff',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    minWidth: '80px'
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h3 style={titleStyle}>
              {(stock.name || stock.symbol).toUpperCase()}
            </h3>
            <p style={subtitleStyle}>MCX N/A</p>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div style={tabsStyle}>
          {['Quick', 'Regular', 'AMO'].map((tab) => (
            <button
              key={tab}
              style={tabStyle(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
          <div style={{marginLeft: 'auto', padding: '12px 16px', fontSize: '14px', color: '#5570F1'}}>
            🏷️ Tags
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          {/* Product Type */}
          <div style={radioGroupStyle}>
            <div style={radioOptionStyle}>
              <input
                type="radio"
                name="productType"
                value="Intraday"
                checked={productType === 'Intraday'}
                onChange={(e) => setProductType(e.target.value)}
              />
              <label>Intraday <span style={{color: '#6b7280'}}>MIS</span></label>
            </div>
            <div style={radioOptionStyle}>
              <input
                type="radio"
                name="productType"
                value="Overnight"
                checked={productType === 'Overnight'}
                onChange={(e) => setProductType(e.target.value)}
              />
              <label>Overnight <span style={{color: '#6b7280'}}>NRML</span></label>
            </div>
            <div style={{marginLeft: 'auto', color: '#5570F1', fontSize: '14px', cursor: 'pointer'}}>
              Advanced ⌄
            </div>
          </div>

          {/* Quantity and Prices */}
          <div style={inputRowStyle}>
            <div style={{...inputGroupStyle, minWidth: '120px'}}>
              <label style={labelStyle}>Qty.</label>
              <div style={{position: 'relative'}}>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(parseInt(e.target.value) || 1)}
                  min="1"
                  style={inputStyle}
                />
                <div style={{position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}}>
                  ▲<br/>▼
                </div>
              </div>
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Market price</label>
              <input
                type="number"
                value={marketPrice}
                onChange={(e) => setMarketPrice(parseFloat(e.target.value) || 0)}
                style={inputStyle}
                disabled={orderType === 'Market'}
              />
            </div>
            
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Trigger price</label>
              <input
                type="number"
                value={triggerPrice}
                onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
                style={inputStyle}
                disabled={orderType === 'Market'}
              />
            </div>
          </div>

          {/* Order Type */}
          <div style={orderTypeGroupStyle}>
            {['Market', 'Limit', 'SL', 'SL-M'].map((type) => (
              <div key={type} style={radioOptionStyle}>
                <input
                  type="radio"
                  name="orderType"
                  value={type}
                  checked={orderType === type}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <div style={marginChargesStyle}>
            Margin N/A &nbsp;&nbsp; Charges N/A 🔄
          </div>
          <div style={buttonGroupStyle}>
            <button
              type="button"
              style={buyButtonStyle}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Placing...' : (side === 'buy' ? 'Buy' : 'Sell')}
            </button>
            <button
              type="button"
              style={cancelButtonStyle}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingModal;