import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const TradingModal = ({ 
  stock, 
  side = 'buy', // 'buy' or 'sell'
  isOpen, 
  onClose 
}) => {
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [intraday, setIntraday] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (stock?.ltp) {
      const stockPrice = typeof stock.ltp === 'string' 
        ? parseFloat(stock.ltp.replace(/[₹,]/g, '')) 
        : parseFloat(stock.ltp);
      setPrice(stockPrice || 0);
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
          price: price.toString()
        },
        orderType: side.toUpperCase(),
        quantity: qty,
        price: price,
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
          alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * price).toFixed(2)}\\n\\nPosition added to your portfolio!`);
        } else {
          alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * price).toFixed(2)}\\n\\nNote: Failed to add to positions.`);
        }
      } else {
        // For SELL orders, just show success message
        alert(`${side.toUpperCase()} order placed successfully!\\n\\nStock: ${orderData.stock.name}\\nQuantity: ${orderData.quantity}\\nPrice: ₹${orderData.price.toFixed(2)}\\nTotal: ₹${(qty * price).toFixed(2)}`);
      }

      onClose();
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(`Error placing ${side.toUpperCase()} order. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalStyle = {
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

  const contentStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    width: '400px',
    maxWidth: '90vw',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #e0e0e0'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: side === 'buy' ? '#1aa774' : '#e26a6a'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666',
    padding: '0',
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: side === 'buy' ? '#1aa774' : '#e26a6a',
    color: '#fff',
    marginTop: '8px'
  };

  const total = (qty * price).toFixed(2);

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            {side === 'buy' ? 'Buy' : 'Sell'} {stock.name || stock.symbol}
          </h3>
          <button style={closeButtonStyle} onClick={onClose}>×</button>
        </div>

        <form style={formStyle} onSubmit={handleSubmit}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Quantity</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(parseInt(e.target.value) || 1)}
              min="1"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              min="0"
              step="0.01"
              style={inputStyle}
              required
            />
          </div>

          <div style={{...inputGroupStyle, flexDirection: 'row', alignItems: 'center', gap: '8px'}}>
            <input
              type="checkbox"
              id="intraday"
              checked={intraday}
              onChange={(e) => setIntraday(e.target.checked)}
            />
            <label htmlFor="intraday" style={labelStyle}>Intraday</label>
          </div>

          <div style={{fontSize: '14px', color: '#666', fontWeight: '500'}}>
            Total: ₹{total}
          </div>

          <button 
            type="submit" 
            style={buttonStyle} 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order...' : `${side === 'buy' ? 'Buy' : 'Sell'} ${stock.name || stock.symbol}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TradingModal;