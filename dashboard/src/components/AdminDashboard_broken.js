import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [holdingsDetailData, setHoldingsDetailData] = useState(null);
  const [positionsDetailData, setPositionsDetailData] = useState(null);
  const [fundsDetailData, setFundsDetailData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('equity');
  const [message, setMessage] = useState('');

  const API_BASE = 'https://zerodha-kite-890j.onrender.com';

  useEffect(() => {
    fetchDashboardData();
    fetchHoldingsDetailData();
    fetchPositionsDetailData();
    fetchFundsDetailData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchHoldingsDetailData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/holdings`);
      const data = await response.json();
      setHoldingsDetailData(data);
    } catch (error) {
      console.error('Error fetching holdings detail data:', error);
      setMessage('Error fetching holdings detail data');
    }
  };

  const fetchPositionsDetailData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/positions`);
      const data = await response.json();
      setPositionsDetailData(data);
    } catch (error) {
      console.error('Error fetching positions detail data:', error);
      setMessage('Error fetching positions detail data');
    }
  };

  const fetchFundsDetailData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/funds`);
      const data = await response.json();
      setFundsDetailData(data);
    } catch (error) {
      console.error('Error fetching funds detail data:', error);
      setMessage('Error fetching funds detail data');
    }
  };

  const updateSection = async (section, updatedData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      await response.json();
      setMessage('Data updated successfully!');
      fetchDashboardData(); // Refresh data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating data:', error);
      setMessage('Error updating data');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value, subField = null) => {
    setDashboardData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: subField ? {
          ...prev[section][field],
          [subField]: value
        } : value
      }
    }));
  };

  const handlePositionChange = (index, field, value) => {
    setDashboardData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        list: prev.positions.list.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const addPosition = () => {
    setDashboardData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        list: [...prev.positions.list, { label: '', percentage: '' }],
        count: prev.positions.list.length + 1
      }
    }));
  };

  const removePosition = (index) => {
    setDashboardData(prev => ({
      ...prev,
      positions: {
        ...prev.positions,
        list: prev.positions.list.filter((_, i) => i !== index),
        count: prev.positions.list.length - 1
      }
    }));
  };

  // Holdings Detail Management Functions
  const updateHoldingsDetail = async (section, updatedData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/holdings/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      setMessage('Holdings data updated successfully!');
      fetchHoldingsDetailData(); // Refresh data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating holdings data:', error);
      setMessage('Error updating holdings data');
    } finally {
      setSaving(false);
    }
  };

  const handleHoldingsInputChange = (section, field, value, subField = null) => {
    setHoldingsDetailData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: subField ? {
          ...prev[section][field],
          [subField]: value
        } : value
      }
    }));
  };

  const handleHoldingItemChange = (index, field, value) => {
    setHoldingsDetailData(prev => ({
      ...prev,
      holdings: prev.holdings.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addHoldingItem = () => {
    setHoldingsDetailData(prev => ({
      ...prev,
      holdings: [...prev.holdings, {
        instrument: '',
        qty: 0,
        avgCost: '',
        ltp: '',
        curVal: '',
        pnl: '',
        netChg: '',
        dayChg: ''
      }],
      count: prev.holdings.length + 1
    }));
  };

  const removeHoldingItem = (index) => {
    setHoldingsDetailData(prev => ({
      ...prev,
      holdings: prev.holdings.filter((_, i) => i !== index),
      count: prev.holdings.length - 1
    }));
  };

  // Positions Detail Management Functions
  const updatePositionsDetail = async (section, updatedData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/positions/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      const result = await response.json();
      setMessage('Positions data updated successfully!');
      fetchPositionsDetailData(); // Refresh data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating positions data:', error);
      setMessage('Error updating positions data');
    } finally {
      setSaving(false);
    }
  };

  // Funds Detail Management Functions
  const updateFundsDetail = async (section, updatedData, settingsData = null) => {
    setSaving(true);
    try {
      let bodyData = updatedData;
      if (section === 'banner' && settingsData) {
        bodyData = { banner: updatedData, settings: settingsData };
      }
      
      const response = await fetch(`${API_BASE}/api/funds/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      });
      const result = await response.json();
      setMessage('Funds data updated successfully!');
      fetchFundsDetailData(); // Refresh data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating funds data:', error);
      setMessage('Error updating funds data');
    } finally {
      setSaving(false);
    }
  };

  const handlePositionItemChange = (index, field, value) => {
    setPositionsDetailData(prev => ({
      ...prev,
      positions: prev.positions.map((item, i) => 
        i === index ? { 
          ...item, 
          [field]: field === 'qty' ? parseInt(value) || 0 : value 
        } : item
      )
    }));
  };

  const addPositionItem = () => {
    setPositionsDetailData(prev => ({
      ...prev,
      positions: [...prev.positions, {
        product: 'NRML',
        instrument: '',
        exchange: '',
        qty: 0,
        avg: '',
        ltp: '',
        pnl: '',
        chg: '',
        holding: false,
        dim: false
      }],
      count: prev.positions.length + 1
    }));
  };

  const removePositionItem = (index) => {
    setPositionsDetailData(prev => ({
      ...prev,
      positions: prev.positions.filter((_, i) => i !== index),
      count: prev.positions.length - 1
    }));
  };

  const handlePositionsTotalsChange = (field, value) => {
    setPositionsDetailData(prev => ({
      ...prev,
      totals: {
        ...prev.totals,
        [field]: value
      }
    }));
  };

  const handleDayHistoryChange = (field, value) => {
    setPositionsDetailData(prev => ({
      ...prev,
      dayHistory: {
        ...prev.dayHistory,
        [field]: field === 'count' ? parseInt(value) || 0 : value
      }
    }));
  };

  const handleBreakdownChange = (index, value) => {
    setPositionsDetailData(prev => ({
      ...prev,
      breakdown: prev.breakdown.map((item, i) => i === index ? value : item)
    }));
  };

  const addBreakdownItem = () => {
    setPositionsDetailData(prev => ({
      ...prev,
      breakdown: [...prev.breakdown, '']
    }));
  };

  const removeBreakdownItem = (index) => {
    setPositionsDetailData(prev => ({
      ...prev,
      breakdown: prev.breakdown.filter((_, i) => i !== index)
    }));
  };

  if (loading || !dashboardData || !holdingsDetailData || !positionsDetailData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Admin Dashboard</h1>
        <p style={styles.subtitle}>Manage your Zerodha Clone dashboard data</p>
        {message && (
          <div style={{
            ...styles.message,
            backgroundColor: message.includes('Error') ? '#fee2e2' : '#dcfce7',
            color: message.includes('Error') ? '#dc2626' : '#16a34a'
          }}>
            {message}
          </div>
        )}
      </div>

            <div style={styles.tabContainer}>
        {['equity', 'commodity', 'holdings', 'holdingsDetail', 'positions', 'positionsDetail', 'funds', 'userInfo'].map(tab => (
          <button
            key={tab}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.activeTab : {})
            }}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'holdingsDetail' ? 'Holdings Detail' : 
             tab === 'positionsDetail' ? 'Positions Detail' : 
             tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

      <div style={styles.content}>
        {activeTab === 'equity' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>⚡ Equity Settings</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Margin Available</label>
                <input
                  style={styles.input}
                  value={dashboardData?.equity?.marginAvailable || ''}
                  onChange={(e) => handleInputChange('equity', 'marginAvailable', e.target.value)}
                  placeholder="e.g., 1L, 50k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Margins Used</label>
                <input
                  style={styles.input}
                  value={dashboardData?.equity?.marginsUsed || ''}
                  onChange={(e) => handleInputChange('equity', 'marginsUsed', e.target.value)}
                  placeholder="e.g., 0, 10k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Opening Balance</label>
                <input
                  style={styles.input}
                  value={dashboardData?.equity?.openingBalance || ''}
                  onChange={(e) => handleInputChange('equity', 'openingBalance', e.target.value)}
                  placeholder="e.g., 1L, 75k"
                />
              </div>
            </div>
            <button
              style={styles.saveButton}
              onClick={() => updateSection('equity', dashboardData?.equity)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Equity Data'}
            </button>
          </div>
        )}

        {activeTab === 'commodity' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>🌾 Commodity Settings</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Margin Available</label>
                <input
                  style={styles.input}
                  value={dashboardData?.commodity?.marginAvailable || ''}
                  onChange={(e) => handleInputChange('commodity', 'marginAvailable', e.target.value)}
                  placeholder="e.g., 50k, 25k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Margins Used</label>
                <input
                  style={styles.input}
                  value={dashboardData?.commodity?.marginsUsed || ''}
                  onChange={(e) => handleInputChange('commodity', 'marginsUsed', e.target.value)}
                  placeholder="e.g., 0, 5k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Opening Balance</label>
                <input
                  style={styles.input}
                  value={dashboardData?.commodity?.openingBalance || ''}
                  onChange={(e) => handleInputChange('commodity', 'openingBalance', e.target.value)}
                  placeholder="e.g., 50k, 30k"
                />
              </div>
            </div>
            <button
              style={styles.saveButton}
              onClick={() => updateSection('commodity', dashboardData?.commodity)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Commodity Data'}
            </button>
          </div>
        )}

        {activeTab === 'holdings' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>💼 Holdings Settings</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Holdings Count</label>
                <input
                  style={styles.input}
                  type="number"
                  value={dashboardData?.holdings?.count || ''}
                  onChange={(e) => handleInputChange('holdings', 'count', parseInt(e.target.value))}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>P&L Amount</label>
                <input
                  style={styles.input}
                  value={dashboardData?.holdings?.pnl || ''}
                  onChange={(e) => handleInputChange('holdings', 'pnl', e.target.value)}
                  placeholder="e.g., 2.24k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>P&L Percentage</label>
                <input
                  style={styles.input}
                  value={dashboardData?.holdings?.pnlPercentage || ''}
                  onChange={(e) => handleInputChange('holdings', 'pnlPercentage', e.target.value)}
                  placeholder="e.g., +16.90%"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Current Value</label>
                <input
                  style={styles.input}
                  value={dashboardData?.holdings?.currentValue || ''}
                  onChange={(e) => handleInputChange('holdings', 'currentValue', e.target.value)}
                  placeholder="e.g., 15.46k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Investment</label>
                <input
                  style={styles.input}
                  value={dashboardData?.holdings?.investment || ''}
                  onChange={(e) => handleInputChange('holdings', 'investment', e.target.value)}
                  placeholder="e.g., 13.23k"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Total Value</label>
                <input
                  style={styles.input}
                  value={dashboardData?.holdings?.totalValue || ''}
                  onChange={(e) => handleInputChange('holdings', 'totalValue', e.target.value)}
                  placeholder="e.g., ₹15,463.77"
                />
              </div>
            </div>
            <button
              style={styles.saveButton}
              onClick={() => updateSection('holdings', dashboardData?.holdings)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Holdings Data'}
            </button>
          </div>
        )}

        {activeTab === 'positions' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📈 Positions Settings</h2>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Positions Count</label>
              <input
                style={styles.input}
                type="number"
                value={dashboardData?.positions?.count || ''}
                onChange={(e) => handleInputChange('positions', 'count', parseInt(e.target.value))}
              />
            </div>
            
            <h3 style={styles.subTitle}>Position Items</h3>
            {(dashboardData?.positions?.list || []).map((position, index) => (
              <div key={index} style={styles.positionRow}>
                <input
                  style={{ ...styles.input, flex: 2 }}
                  value={position.label}
                  onChange={(e) => handlePositionChange(index, 'label', e.target.value)}
                  placeholder="Position label"
                />
                <input
                  style={{ ...styles.input, flex: 1 }}
                  value={position.percentage}
                  onChange={(e) => handlePositionChange(index, 'percentage', e.target.value)}
                  placeholder="e.g., 88%"
                />
                <button
                  style={styles.removeButton}
                  onClick={() => removePosition(index)}
                >
                  ❌
                </button>
              </div>
            ))}
            
            <button style={styles.addButton} onClick={addPosition}>
              ➕ Add Position
            </button>
            
            <button
              style={styles.saveButton}
              onClick={() => updateSection('positions', dashboardData?.positions)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Positions Data'}
            </button>
          </div>
        )}

        {activeTab === 'userInfo' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>👤 User Info Settings</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>User Name</label>
                <input
                  style={styles.input}
                  value={dashboardData?.userInfo?.name || ''}
                  onChange={(e) => handleInputChange('userInfo', 'name', e.target.value)}
                  placeholder="e.g., Sayad"
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Greeting Message</label>
                <input
                  style={styles.input}
                  value={dashboardData?.userInfo?.greeting || ''}
                  onChange={(e) => handleInputChange('userInfo', 'greeting', e.target.value)}
                  placeholder="e.g., Hi, Sayad"
                />
              </div>
            </div>
            <button
              style={styles.saveButton}
              onClick={() => updateSection('userInfo', dashboardData?.userInfo)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save User Info'}
            </button>
          </div>
        )}

        {activeTab === 'holdingsDetail' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📊 Holdings Detail Management</h2>
            
            {/* Holdings Metrics */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>📈 Holdings Metrics</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Investment</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.metrics?.totalInvestment || ''}
                    onChange={(e) => handleHoldingsInputChange('metrics', 'totalInvestment', e.target.value)}
                    placeholder="e.g., 29,875.55"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Current Value</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.metrics?.currentValue || ''}
                    onChange={(e) => handleHoldingsInputChange('metrics', 'currentValue', e.target.value)}
                    placeholder="e.g., 31,428.95"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Day's P&L</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.metrics?.daysPnl || ''}
                    onChange={(e) => handleHoldingsInputChange('metrics', 'daysPnl', e.target.value)}
                    placeholder="e.g., 0.55%"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total P&L</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.metrics?.totalPnl || ''}
                    onChange={(e) => handleHoldingsInputChange('metrics', 'totalPnl', e.target.value)}
                    placeholder="e.g., 1,553.40"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total P&L Percentage</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.metrics?.totalPnlPercentage || ''}
                    onChange={(e) => handleHoldingsInputChange('metrics', 'totalPnlPercentage', e.target.value)}
                    placeholder="e.g., 5.20%"
                  />
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updateHoldingsDetail('metrics', holdingsDetailData?.metrics)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Holdings Metrics'}
              </button>
            </div>

            {/* Holdings List */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>📋 Holdings List</h3>
              {(holdingsDetailData?.holdings || []).map((holding, index) => (
                <div key={index} style={styles.holdingRow}>
                  <div style={styles.holdingGrid}>
                    <input
                      style={styles.input}
                      value={holding.instrument}
                      onChange={(e) => handleHoldingItemChange(index, 'instrument', e.target.value)}
                      placeholder="Instrument"
                    />
                    <input
                      style={styles.input}
                      type="number"
                      value={holding.qty}
                      onChange={(e) => handleHoldingItemChange(index, 'qty', parseInt(e.target.value))}
                      placeholder="Qty"
                    />
                    <input
                      style={styles.input}
                      value={holding.avgCost}
                      onChange={(e) => handleHoldingItemChange(index, 'avgCost', e.target.value)}
                      placeholder="Avg Cost"
                    />
                    <input
                      style={styles.input}
                      value={holding.ltp}
                      onChange={(e) => handleHoldingItemChange(index, 'ltp', e.target.value)}
                      placeholder="LTP"
                    />
                    <input
                      style={styles.input}
                      value={holding.curVal}
                      onChange={(e) => handleHoldingItemChange(index, 'curVal', e.target.value)}
                      placeholder="Current Value"
                    />
                    <input
                      style={styles.input}
                      value={holding.pnl}
                      onChange={(e) => handleHoldingItemChange(index, 'pnl', e.target.value)}
                      placeholder="P&L"
                    />
                    <input
                      style={styles.input}
                      value={holding.netChg}
                      onChange={(e) => handleHoldingItemChange(index, 'netChg', e.target.value)}
                      placeholder="Net Change"
                    />
                    <input
                      style={styles.input}
                      value={holding.dayChg}
                      onChange={(e) => handleHoldingItemChange(index, 'dayChg', e.target.value)}
                      placeholder="Day Change"
                    />
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeHoldingItem(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              
              <button style={styles.addButton} onClick={addHoldingItem}>
                ➕ Add Holding
              </button>
              
              <button
                style={styles.saveButton}
                onClick={() => updateHoldingsDetail('list', { holdings: holdingsDetailData?.holdings })}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Holdings List'}
              </button>
            </div>

            {/* Holdings Totals */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>🎯 Holdings Totals</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Current Value</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.totals?.totalCurrentValue || ''}
                    onChange={(e) => handleHoldingsInputChange('totals', 'totalCurrentValue', e.target.value)}
                    placeholder="e.g., 31,428.95"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total P&L</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.totals?.totalPnl || ''}
                    onChange={(e) => handleHoldingsInputChange('totals', 'totalPnl', e.target.value)}
                    placeholder="e.g., 1,553.40"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Net Change</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.totals?.totalNetChg || ''}
                    onChange={(e) => handleHoldingsInputChange('totals', 'totalNetChg', e.target.value)}
                    placeholder="e.g., 5.20%"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Day Change</label>
                  <input
                    style={styles.input}
                    value={holdingsDetailData?.totals?.totalDayChg || ''}
                    onChange={(e) => handleHoldingsInputChange('totals', 'totalDayChg', e.target.value)}
                    placeholder="e.g., 0.55%"
                  />
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updateHoldingsDetail('totals', holdingsDetailData?.totals)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Holdings Totals'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'positionsDetail' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>📈 Positions Detail Management</h2>
            
            {/* Positions List */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>📋 Positions List</h3>
              {(positionsDetailData?.positions || []).map((position, index) => (
                <div key={index} style={styles.holdingRow}>
                  <div style={styles.holdingGrid}>
                    <select
                      style={styles.input}
                      value={position.product}
                      onChange={(e) => handlePositionItemChange(index, 'product', e.target.value)}
                    >
                      <option value="NRML">NRML</option>
                      <option value="MIS">MIS</option>
                      <option value="CNC">CNC</option>
                    </select>
                    <input
                      style={styles.input}
                      value={position.instrument}
                      onChange={(e) => handlePositionItemChange(index, 'instrument', e.target.value)}
                      placeholder="Instrument"
                    />
                    <input
                      style={styles.input}
                      value={position.exchange}
                      onChange={(e) => handlePositionItemChange(index, 'exchange', e.target.value)}
                      placeholder="Exchange"
                    />
                    <input
                      style={styles.input}
                      type="number"
                      value={position.qty}
                      onChange={(e) => handlePositionItemChange(index, 'qty', e.target.value)}
                      placeholder="Qty"
                    />
                    <input
                      style={styles.input}
                      value={position.avg}
                      onChange={(e) => handlePositionItemChange(index, 'avg', e.target.value)}
                      placeholder="Avg"
                    />
                    <input
                      style={styles.input}
                      value={position.ltp}
                      onChange={(e) => handlePositionItemChange(index, 'ltp', e.target.value)}
                      placeholder="LTP"
                    />
                    <input
                      style={styles.input}
                      value={position.pnl}
                      onChange={(e) => handlePositionItemChange(index, 'pnl', e.target.value)}
                      placeholder="P&L"
                    />
                    <input
                      style={styles.input}
                      value={position.chg}
                      onChange={(e) => handlePositionItemChange(index, 'chg', e.target.value)}
                      placeholder="Change %"
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      <input
                        type="checkbox"
                        checked={position.holding}
                        onChange={(e) => handlePositionItemChange(index, 'holding', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Holding
                    </label>
                    <label style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      <input
                        type="checkbox"
                        checked={position.dim}
                        onChange={(e) => handlePositionItemChange(index, 'dim', e.target.checked)}
                        style={{ marginRight: '0.5rem' }}
                      />
                      Dim
                    </label>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => removePositionItem(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              
              <button style={styles.addButton} onClick={addPositionItem}>
                ➕ Add Position
              </button>
              
              <button
                style={styles.saveButton}
                onClick={() => updatePositionsDetail('list', { positions: positionsDetailData?.positions })}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Positions List'}
              </button>
            </div>

            {/* Day History */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>📅 Day History</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>History Count</label>
                  <input
                    style={styles.input}
                    type="number"
                    value={positionsDetailData?.dayHistory?.count || ''}
                    onChange={(e) => handleDayHistoryChange('count', e.target.value)}
                    placeholder="e.g., 7"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Expanded View</label>
                  <select
                    style={styles.input}
                    value={positionsDetailData?.dayHistory?.expanded}
                    onChange={(e) => handleDayHistoryChange('expanded', e.target.value === 'true')}
                  >
                    <option value="false">Collapsed</option>
                    <option value="true">Expanded</option>
                  </select>
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updatePositionsDetail('dayhistory', positionsDetailData?.dayHistory)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Day History'}
              </button>
            </div>

            {/* Breakdown */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>📊 Breakdown Chart</h3>
              {(positionsDetailData?.breakdown || []).map((item, index) => (
                <div key={index} style={styles.positionRow}>
                  <input
                    style={{ ...styles.input, flex: 1 }}
                    value={item}
                    onChange={(e) => handleBreakdownChange(index, e.target.value)}
                    placeholder="Breakdown item"
                  />
                  <button
                    style={styles.removeButton}
                    onClick={() => removeBreakdownItem(index)}
                  >
                    ❌
                  </button>
                </div>
              ))}
              
              <button style={styles.addButton} onClick={addBreakdownItem}>
                ➕ Add Breakdown Item
              </button>
              
              <button
                style={styles.saveButton}
                onClick={() => updatePositionsDetail('breakdown', { breakdown: positionsDetailData?.breakdown })}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Breakdown'}
              </button>
            </div>

            {/* Totals */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>🎯 Position Totals</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total P&L</label>
                  <input
                    style={styles.input}
                    value={positionsDetailData?.totals?.totalPnl || ''}
                    onChange={(e) => handlePositionsTotalsChange('totalPnl', e.target.value)}
                    placeholder="e.g., -337.75"
                  />
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updatePositionsDetail('totals', positionsDetailData?.totals)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Position Totals'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'funds' && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Funds Management</h2>
            {fundsDetailData ? (
              <div style={styles.section}>
                <h3 style={styles.subsectionTitle}>Funds Data</h3>
                <p>Equity Available Margin: {fundsDetailData.equity?.availableMargin || 'N/A'}</p>
                <p>Commodity Available Margin: {fundsDetailData.commodity?.availableMargin || 'N/A'}</p>
              </div>
            ) : (
              <p>Loading funds data...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#64748b',
    margin: '0',
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    display: 'inline-block',
  },
  tabContainer: {
    backgroundColor: '#fff',
    padding: '0 2rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '0.5rem',
  },
  tab: {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s',
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  content: {
    padding: '2rem',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '1.5rem',
  },
  subTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#374151',
    marginTop: '1.5rem',
    marginBottom: '1rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    transition: 'border-color 0.2s',
    outline: 'none',
  },
  positionRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 2rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  checkbox: {
    width: '1.25rem',
    height: '1.25rem',
    cursor: 'pointer',
  },
  addButton: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  removeButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  subsection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
  },
  holdingRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    border: '1px solid #e2e8f0',
  },
  holdingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 100px 100px 120px 100px 100px 100px',
    gap: '0.5rem',
    flex: 1,
  },
};

// Add CSS for spinner animation
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;