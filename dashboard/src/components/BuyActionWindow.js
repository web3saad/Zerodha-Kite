import React, { useState, useEffect } from 'react';
import './BuyActionWindow.css';
import { useAuth } from "../hooks/useAuth";

const BuyActionWindow = ({ stock, orderType, onClose, onSubmit }) => {
  const [selectedExchange, setSelectedExchange] = useState('BSE');
  const [orderMode, setOrderMode] = useState('Quick');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);
  const [isIntraday, setIsIntraday] = useState(false);
  const [stockPrice, setStockPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (stock) {
      setLoading(true);
      
      // First, use the price from the stock object if available
      if (stock.price) {
        const currentPrice = parseFloat(stock.price);
        setStockPrice(currentPrice);
        setPrice(currentPrice);
        setLoading(false);
        return;
      }

      // If no price in stock object, try to fetch from API
      const fetchStockPrice = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/stocks/stock/${stock.symbol || stock.name}`);
          const data = await response.json();
          
          if (data.chart?.result?.[0]) {
            const result = data.chart.result[0];
            const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
            setStockPrice(currentPrice);
            setPrice(currentPrice);
          } else {
            // Fallback price if API doesn't return data
            const fallbackPrice = parseFloat((Math.random() * 1000 + 100).toFixed(2));
            setStockPrice(fallbackPrice);
            setPrice(fallbackPrice);
          }
        } catch (error) {
          console.error('Error fetching stock price:', error);
          // Fallback price if API call fails
          const fallbackPrice = parseFloat((Math.random() * 1000 + 100).toFixed(2));
          setStockPrice(fallbackPrice);
          setPrice(fallbackPrice);
        } finally {
          setLoading(false);
        }
      };

      fetchStockPrice();
    }
  }, [stock]);

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleSubmit = () => {
    const orderData = {
      stock,
      orderType,
      exchange: selectedExchange,
      quantity,
      price,
      isIntraday,
      total: (quantity * price).toFixed(2)
    };
    
    if (onSubmit) {
      onSubmit(orderData);
    }
    
    onClose();
  };

  const handleCancelClick = () => {
    onClose();
  };

  const totalAmount = (quantity * price).toFixed(2);
  const availableAmount = 1279.80; // Mock available amount

  if (!stock) return null;

  return (
    <div className="buy-action-overlay">
      <div className="buy-action-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="stock-info">
            <h3 className="stock-name">{stock.name}</h3>
            <div className="stock-details">
              <span className="stock-exchange">{selectedExchange}</span>
              <span className="stock-price">₹{stockPrice?.toFixed(2) || price.toFixed(2)}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Exchange Toggle */}
        <div className="exchange-toggle">
          <button 
            className={`exchange-btn ${selectedExchange === 'BSE' ? 'active' : ''}`}
            onClick={() => setSelectedExchange('BSE')}
          >
            BSE ₹{price.toFixed(2)}
          </button>
          <button 
            className={`exchange-btn ${selectedExchange === 'NSE' ? 'active' : ''}`}
            onClick={() => setSelectedExchange('NSE')}
          >
            NSE ₹{(price + 0.35).toFixed(2)}
          </button>
        </div>

        {/* Order Mode Toggle */}
        <div className="order-mode-toggle">
          <button 
            className={`mode-btn ${orderMode === 'Quick' ? 'active' : ''}`}
            onClick={() => setOrderMode('Quick')}
          >
            Quick
          </button>
          <button 
            className={`mode-btn ${orderMode === 'Regular' ? 'active' : ''}`}
            onClick={() => setOrderMode('Regular')}
          >
            Regular
          </button>
          <button 
            className={`mode-btn ${orderMode === 'Cover' ? 'active' : ''}`}
            onClick={() => setOrderMode('Cover')}
          >
            Cover
          </button>
        </div>

        {/* Quantity Section */}
        <div className="quantity-section">
          <label>Qty.</label>
          <div className="quantity-controls">
            <button 
              className="qty-btn" 
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
            >
              ▼
            </button>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="quantity-input"
            />
            <button 
              className="qty-btn" 
              onClick={() => handleQuantityChange(1)}
            >
              ▲
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="price-section">
          <label>Price</label>
          <div className="price-display">
            <span className="price-value">₹{price.toFixed(2)}</span>
            <button className="price-close-btn">✕</button>
          </div>
        </div>

        {/* Intraday Toggle */}
        <div className="intraday-section">
          <label className="intraday-label">
            <input 
              type="checkbox" 
              checked={isIntraday}
              onChange={(e) => setIsIntraday(e.target.checked)}
            />
            Intraday
          </label>
        </div>

        {/* Total Amount */}
        <div className="total-section">
          <div className="total-row">
            <span>Req. ₹{totalAmount} +0.99</span>
            <span>Avail. ₹{availableAmount} ✓</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={handleCancelClick}>
            Cancel
          </button>
          <button 
            className={`submit-btn ${orderType === 'BUY' ? 'buy-btn-modal' : 'sell-btn-modal'}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Loading...' : orderType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyActionWindow;
