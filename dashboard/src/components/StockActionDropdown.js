import React, { useState, useEffect, useRef } from 'react';

const StockActionDropdown = ({ 
  stock, 
  isOpen, 
  onClose, 
  position, 
  onExit, 
  onAdd,
  onChart,
  isPosition = false // true for positions, false for holdings
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const dropdownStyle = {
    position: 'absolute',
    top: position.top + 'px',
    left: position.left + 'px',
    backgroundColor: '#fff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '160px',
    padding: '8px 0',
    fontSize: '13px',
    fontFamily: 'Inter, sans-serif'
  };

  const itemStyle = {
    padding: '8px 16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'background-color 0.2s'
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = '#f5f5f5';
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = 'transparent';
  };

  const handleExit = () => {
    onExit(stock);
    onClose();
  };

  const handleAdd = () => {
    onAdd(stock);
    onClose();
  };

  const handleChart = () => {
    onChart(stock);
    onClose();
  };

  const handleInfo = () => {
    console.log('Info clicked for:', stock);
    onClose();
  };

  const handleConvert = () => {
    console.log('Convert clicked for:', stock);
    onClose();
  };

  const handleCreateAlert = () => {
    console.log('Create alert clicked for:', stock);
    onClose();
  };

  const handleMarketDepth = () => {
    console.log('Market depth clicked for:', stock);
    onClose();
  };

  const handleAddToWatchlist = () => {
    console.log('Add to marketwatch clicked for:', stock);
    onClose();
  };

  const handleTechnicals = () => {
    console.log('Technicals clicked for:', stock);
    onClose();
  };

  return (
    <div ref={dropdownRef} style={dropdownStyle}>
      {/* Exit option */}
      <div 
        style={{...itemStyle, color: '#e26a6a'}} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleExit}
      >
        <span>🚪</span>
        <span>Exit</span>
      </div>

      {/* Add option */}
      <div 
        style={{...itemStyle, color: '#1aa774'}} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleAdd}
      >
        <span>➕</span>
        <span>Add</span>
      </div>

      {/* Separator */}
      <div style={{height: '1px', backgroundColor: '#e0e0e0', margin: '4px 0'}}></div>

      {/* Convert option (only for positions) */}
      {isPosition && (
        <div 
          style={itemStyle} 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleConvert}
        >
          <span>🔄</span>
          <span>Convert</span>
        </div>
      )}

      {/* Info option */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleInfo}
      >
        <span>ℹ️</span>
        <span>Info</span>
      </div>

      {/* Create alert */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleCreateAlert}
      >
        <span>🚨</span>
        <span>Create alert</span>
      </div>

      {/* Market depth */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMarketDepth}
      >
        <span>📊</span>
        <span>Market depth</span>
      </div>

      {/* Chart */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleChart}
      >
        <span>📈</span>
        <span>Chart</span>
      </div>

      {/* Add to marketwatch */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleAddToWatchlist}
      >
        <span>👁️</span>
        <span>Add to marketwatch</span>
      </div>

      {/* Technicals */}
      <div 
        style={itemStyle} 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTechnicals}
      >
        <span>⚡</span>
        <span>Technicals</span>
      </div>
    </div>
  );
};

export default StockActionDropdown;