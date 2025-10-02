import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [holdingsDetailData, setHoldingsDetailData] = useState(null);
  const [positionsDetailData, setPositionsDetailData] = useState(null);
  const [fundsData, setFundsData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [consoleData, setConsoleData] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('equity');
  const [message, setMessage] = useState('');

  const API_BASE = API_BASE_URL;

  useEffect(() => {
    fetchDashboardData();
    fetchHoldingsDetailData();
    fetchPositionsDetailData();
    fetchFundsData();
    fetchOrdersData();
    fetchAccountData();
    fetchConsoleData();
    fetchPortfolioData();
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

  const fetchFundsData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/funds`);
      const data = await response.json();
      setFundsData(data);
    } catch (error) {
      console.error('Error fetching funds data:', error);
      setMessage('Error fetching funds data');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/orders-page`);
      const data = await response.json();
      setOrdersData(data);
    } catch (error) {
      console.error('Error fetching orders data:', error);
      setMessage('Error fetching orders data');
    }
  };

  const fetchAccountData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/account`);
      const data = await response.json();
      setAccountData(data);
    } catch (error) {
      console.error('Error fetching account data:', error);
      setMessage('Error fetching account data');
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

  // Orders Management Functions
  const handleOrderChange = (section, index, field, value) => {
    setOrdersData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addOrder = (section) => {
    const newOrder = section === 'openOrders' ? {
      id: Date.now(),
      t: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'buy',
      inst: '',
      ex: 'NSE',
      prod: 'MIS',
      qty: '0 / 1',
      ltp: '0.00',
      price: '0.00',
      status: 'open'
    } : {
      id: Date.now(),
      t: new Date().toLocaleTimeString('en-US', { hour12: false }),
      type: 'buy',
      inst: '',
      ex: 'NSE',
      prod: 'MIS',
      qty: '0 / 1',
      avg: '0.00',
      status: 'complete'
    };

    setOrdersData(prev => ({
      ...prev,
      [section]: [...(prev[section] || []), newOrder]
    }));
  };

  const removeOrder = (section, index) => {
    setOrdersData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  const saveOrdersData = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/orders-page`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          openOrders: ordersData.openOrders || [],
          executedOrders: ordersData.executedOrders || []
        }),
      });
      
      if (response.ok) {
        setMessage('Orders data updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update orders data');
      }
    } catch (error) {
      console.error('Error updating orders data:', error);
      setMessage('Error updating orders data');
    } finally {
      setSaving(false);
    }
  };

  // Account Management Functions
  const handleAccountChange = (section, field, value) => {
    setAccountData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleVerifiedPLSegmentChange = (segment, value) => {
    setAccountData(prev => ({
      ...prev,
      verifiedPL: {
        ...prev.verifiedPL,
        segments: {
          ...prev.verifiedPL.segments,
          [segment]: value
        }
      }
    }));
  };

  const saveAccountData = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personal: accountData.personal,
          demat: accountData.demat,
          verifiedPL: accountData.verifiedPL
        }),
      });
      
      if (response.ok) {
        setMessage('Account data updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error('Failed to update account data');
      }
    } catch (error) {
      console.error('Error updating account data:', error);
      setMessage('Error updating account data');
    } finally {
      setSaving(false);
    }
  };

  // Console Management Functions
  const fetchConsoleData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/console`);
      const data = await response.json();
      setConsoleData(data);
    } catch (error) {
      console.error('Error fetching console data:', error);
      setMessage('Error fetching console data');
    }
  };

  const updateConsoleData = async (updatedData) => {
    setSaving(true);
    try {
      console.log('Sending console data:', updatedData);
      
      const response = await fetch(`${API_BASE}/api/console`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        setMessage('Console data updated successfully!');
        fetchConsoleData(); // Refresh data
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to update console data: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating console data:', error);
      setMessage(`Error updating console data: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  // Portfolio Management Functions
  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/portfolio`);
      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setMessage('Error fetching portfolio data');
    }
  };

  const updatePortfolioData = async (updatedData) => {
    setSaving(true);
    try {
      console.log('Sending portfolio data:', updatedData);
      
      const response = await fetch(`${API_BASE}/api/portfolio`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        setMessage('Portfolio data updated successfully!');
        fetchPortfolioData(); // Refresh data
        setTimeout(() => setMessage(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to update portfolio data: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error('Error updating portfolio data:', error);
      setMessage(`Error updating portfolio data: ${error.message}`);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handlePortfolioInputChange = (field, value, index = null, section = null) => {
    setPortfolioData(prev => {
      if (!prev) return prev;
      
      if (field === 'metrics') {
        return { ...prev, metrics: { ...prev.metrics, ...value } };
      } else if (field === 'accountMix' && index !== null) {
        const newAccountMix = [...prev.accountMix];
        newAccountMix[index] = { ...newAccountMix[index], ...value };
        return { ...prev, accountMix: newAccountMix };
      } else if (field === 'sectors' && index !== null) {
        const newSectors = [...prev.sectors];
        newSectors[index] = { ...newSectors[index], ...value };
        return { ...prev, sectors: newSectors };
      } else if (field === 'stocks' && section === 'capMix' && index !== null) {
        const newCapMix = [...prev.stocks.capMix];
        newCapMix[index] = { ...newCapMix[index], ...value };
        return { ...prev, stocks: { ...prev.stocks, capMix: newCapMix } };
      } else if (field === 'stocks' && section === 'rows' && index !== null) {
        const newRows = [...prev.stocks.rows];
        newRows[index] = { ...newRows[index], ...value };
        return { ...prev, stocks: { ...prev.stocks, rows: newRows } };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const addPortfolioAccountMixItem = () => {
    setPortfolioData(prev => ({
      ...prev,
      accountMix: [...prev.accountMix, {
        label: `New Asset ${prev.accountMix.length + 1}`,
        color: "#94a3b8",
        pct: 0.01
      }]
    }));
  };

  const removePortfolioAccountMixItem = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      accountMix: prev.accountMix.filter((_, i) => i !== index)
    }));
  };

  const addPortfolioSectorItem = () => {
    setPortfolioData(prev => ({
      ...prev,
      sectors: [...prev.sectors, {
        label: `New Sector ${prev.sectors.length + 1}`,
        color: "#94a3b8",
        pct: 0.01
      }]
    }));
  };

  const removePortfolioSectorItem = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      sectors: prev.sectors.filter((_, i) => i !== index)
    }));
  };

  const addPortfolioStockRow = () => {
    setPortfolioData(prev => ({
      ...prev,
      stocks: {
        ...prev.stocks,
        rows: [...prev.stocks.rows, {
          instrument: `NEW_STOCK_${prev.stocks.rows.length + 1}`,
          qty: 1,
          avgPrice: 100.00,
          ltp: 105.00,
          pnl: 5.00,
          netChg: 5.00,
          dayChg: 5.00
        }]
      }
    }));
  };

  const removePortfolioStockRow = (index) => {
    setPortfolioData(prev => ({
      ...prev,
      stocks: {
        ...prev.stocks,
        rows: prev.stocks.rows.filter((_, i) => i !== index)
      }
    }));
  };

  const handleConsoleInputChange = (field, value, index = null) => {
    setConsoleData(prev => {
      if (!prev) return prev;
      
      if (field === 'portfolioData' && index !== null) {
        const newPortfolioData = [...prev.portfolioData];
        newPortfolioData[index] = { ...newPortfolioData[index], ...value };
        return { ...prev, portfolioData: newPortfolioData };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  const addPortfolioItem = () => {
    setConsoleData(prev => ({
      ...prev,
      portfolioData: [...prev.portfolioData, {
        symbol: `NEW_STOCK_${prev.portfolioData.length + 1}`,
        qty: 1,
        buyAvg: 100,
        buyVal: 100,
        sellAvg: 100,
        sellVal: 100,
        realisedPL: '+₹0.00',
        realisedAmount: 0,
        unrealisedPL: '—'
      }]
    }));
  };

  const removePortfolioItem = (index) => {
    setConsoleData(prev => ({
      ...prev,
      portfolioData: prev.portfolioData.filter((_, i) => i !== index)
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

  const updateFunds = async (section, updatedData) => {
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/api/funds`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section, data: updatedData }),
      });
      await response.json();
      setMessage('Funds data updated successfully!');
      fetchFundsData(); // Refresh data
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating funds data:', error);
      setMessage('Error updating funds data');
    } finally {
      setSaving(false);
    }
  };

  const handleFundsInputChange = (section, field, value) => {
    setFundsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };


  // Sidebar collapse state for mobile (must be before any return)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleSidebarToggle = () => setSidebarOpen((open) => !open);

  if (loading || !dashboardData || !holdingsDetailData || !positionsDetailData || !fundsData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  // Sidebar navigation items
  const navTabs = [
    { key: 'equity', label: 'Equity', icon: '⚡' },
    { key: 'commodity', label: 'Commodity', icon: '🌾' },
    { key: 'holdings', label: 'Holdings', icon: '💼' },
    { key: 'holdingsDetail', label: 'Holdings Detail', icon: '📊' },
    { key: 'positions', label: 'Positions', icon: '📈' },
    { key: 'positionsDetail', label: 'Positions Detail', icon: '📈' },
    { key: 'funds', label: 'Funds', icon: '💰' },
    { key: 'orders', label: 'Orders', icon: '📋' },
    { key: 'account', label: 'Account', icon: '👤' },
    { key: 'console', label: 'Console', icon: '📊' },
    { key: 'portfolio', label: 'Portfolio', icon: '📈' },
    { key: 'userInfo', label: 'User Info', icon: '👤' },
  ];

  return (
    <div className="admin-dashboard" style={styles.container}>
      {/* Topbar */}
      <div style={styles.topbar}>
        {/* Floating sidebar open button (mobile/overlay only) */}
        {!sidebarOpen && (
          <button
            className="sidebar-fab-open"
            style={styles.sidebarFabOpen}
            onClick={handleSidebarToggle}
            aria-label="Open sidebar"
          >
            <span style={{fontSize: '2rem'}}>☰</span>
          </button>
        )}
        <div style={styles.headerContent}>
          <h1 style={styles.title}>📊 Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage your Zerodha Clone dashboard data</p>
        </div>
        
        {/* Preview Button */}
        <button
          style={styles.previewButton}
          onClick={() => window.open('https://zerodha-kite-zeta.vercel.app/', '_blank')}
          title="Preview Dashboard"
        >
          <span style={styles.previewIcon}>👁️</span>
          <span>Preview</span>
        </button>

        {message && (
          <div style={{
            ...styles.message,
            ...(message.includes('Error') ? styles.errorBadge : styles.successBadge),
            backgroundColor: message.includes('Error') ? '#fef2f2' : '#dcfce7',
            color: message.includes('Error') ? '#dc2626' : '#16a34a',
            marginLeft: 'auto',
            marginRight: '1rem',
            alignSelf: 'center',
          }}>
            {message}
          </div>
        )}
      </div>

      {/* Mobile sidebar overlay/backdrop */}
      {sidebarOpen && (
        <div style={styles.sidebarBackdrop} onClick={handleSidebarToggle}></div>
      )}

      {/* Main layout: sidebar + content */}
      <div style={styles.layoutGrid}>
        {/* Sidebar */}
        <nav
          className={`admin-sidebar${sidebarOpen ? ' open' : ''}`}
          style={{
            ...styles.sidebar,
            ...(sidebarOpen ? styles.sidebarOpen : {}),
          }}
        >
          <div style={styles.sidebarHeader}>
            <span style={{fontWeight: 700, fontSize: '1.2rem', color: '#1e293b'}}>Admin</span>
            <button
              className="sidebar-close"
              style={styles.sidebarClose}
              onClick={handleSidebarToggle}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>
          <ul style={styles.sidebarNavList}>
            {navTabs.map(tab => (
              <li key={tab.key} style={{marginBottom: '0.5rem'}}>
                <button
                  style={{
                    ...styles.sidebarNavButton,
                    ...(activeTab === tab.key ? styles.sidebarNavButtonActive : {}),
                    fontSize: '1.15rem',
                    padding: '1rem',
                  }}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSidebarOpen(false);
                  }}
                >
                  <span style={{marginRight: '1rem', fontSize: '1.3em'}}>{tab.icon}</span>
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <div className="content" style={styles.contentMobileWrap}>
        {activeTab === 'equity' && (
          <div className="admin-section" style={styles.sectionCard}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>⚡ Equity Settings</h2>
            </div>
            <div style={styles.formGridBetter}>
              <div style={styles.inputGroupBetter}>
                <label style={styles.labelBetter}>Margin Available</label>
                <input
                  style={styles.inputBetter}
                  value={dashboardData?.equity?.marginAvailable || ''}
                  onChange={(e) => handleInputChange('equity', 'marginAvailable', e.target.value)}
                  placeholder="e.g., 1L, 50k"
                />
              </div>
              <div style={styles.inputGroupBetter}>
                <label style={styles.labelBetter}>Margins Used</label>
                <input
                  style={styles.inputBetter}
                  value={dashboardData?.equity?.marginsUsed || ''}
                  onChange={(e) => handleInputChange('equity', 'marginsUsed', e.target.value)}
                  placeholder="e.g., 0, 10k"
                />
              </div>
              <div style={styles.inputGroupBetter}>
                <label style={styles.labelBetter}>Opening Balance</label>
                <input
                  style={styles.inputBetter}
                  value={dashboardData?.equity?.openingBalance || ''}
                  onChange={(e) => handleInputChange('equity', 'openingBalance', e.target.value)}
                  placeholder="e.g., 1L, 75k"
                />
              </div>
            </div>
            <button
              style={styles.saveButtonBetter}
              onClick={() => updateSection('equity', dashboardData?.equity)}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Equity Data'}
            </button>
          </div>
        )}

        {activeTab === 'commodity' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>🌾 Commodity Settings</h2>
            </div>
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
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>💼 Holdings Settings</h2>
            </div>
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
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📈 Positions Settings</h2>
            </div>
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

        {activeTab === 'funds' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>💰 Funds Management</h2>
              <div style={{...styles.badge, ...styles.successBadge}}>Live Data</div>
            </div>
            
            {/* Equity Funds */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>⚡ Equity Funds</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Available Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.availableMargin || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'availableMargin', e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Used Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.usedMargin || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'usedMargin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Available Cash</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.availableCash || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'availableCash', e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Opening Balance</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.openingBalance || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'openingBalance', e.target.value)}
                    placeholder="e.g., 100000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Payin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.payin || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'payin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Payout</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.payout || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'payout', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SPAN</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.span || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'span', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Delivery Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.deliveryMargin || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'deliveryMargin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Exposure</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.exposure || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'exposure', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Options Premium</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.optionsPremium || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'optionsPremium', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Collateral (Liquid Funds)</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.collateralLiquidFunds || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'collateralLiquidFunds', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Collateral (Equity)</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.collateralEquity || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'collateralEquity', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Collateral</label>
                  <input
                    style={styles.input}
                    value={fundsData?.equity?.totalCollateral || ''}
                    onChange={(e) => handleFundsInputChange('equity', 'totalCollateral', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updateFunds('equity', fundsData?.equity)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Equity Funds'}
              </button>
            </div>

            {/* Commodity Funds */}
            <div style={styles.subsection}>
              <h3 style={styles.subTitle}>🌾 Commodity Funds</h3>
              <div style={styles.formGrid}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Available Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.availableMargin || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'availableMargin', e.target.value)}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Used Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.usedMargin || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'usedMargin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Available Cash</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.availableCash || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'availableCash', e.target.value)}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Opening Balance</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.openingBalance || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'openingBalance', e.target.value)}
                    placeholder="e.g., 50000"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Payin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.payin || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'payin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Payout</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.payout || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'payout', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>SPAN</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.span || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'span', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Delivery Margin</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.deliveryMargin || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'deliveryMargin', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Exposure</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.exposure || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'exposure', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Options Premium</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.optionsPremium || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'optionsPremium', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Collateral (Liquid Funds)</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.collateralLiquidFunds || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'collateralLiquidFunds', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Collateral (Equity)</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.collateralEquity || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'collateralEquity', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Total Collateral</label>
                  <input
                    style={styles.input}
                    value={fundsData?.commodity?.totalCollateral || ''}
                    onChange={(e) => handleFundsInputChange('commodity', 'totalCollateral', e.target.value)}
                    placeholder="e.g., 0"
                  />
                </div>
              </div>
              <button
                style={styles.saveButton}
                onClick={() => updateFunds('commodity', fundsData?.commodity)}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Commodity Funds'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📋 Orders Management</h2>
              <div style={{...styles.badge, ...styles.successBadge}}>Live Data</div>
            </div>
            
            {ordersData ? (
              <>
                {/* Open Orders Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subTitle}>🔓 Open Orders ({ordersData.openOrders?.length || 0})</h3>
                  
                  {(ordersData.openOrders || []).map((order, index) => (
                    <div key={order.id || index} style={styles.orderRow}>
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.t || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 't', e.target.value)}
                        placeholder="Time (e.g., 13:39:12)"
                      />
                      <select
                        style={{ ...styles.input, flex: 1 }}
                        value={order.type || 'buy'}
                        onChange={(e) => handleOrderChange('openOrders', index, 'type', e.target.value)}
                      >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </select>
                      <input
                        style={{ ...styles.input, flex: 2 }}
                        value={order.inst || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'inst', e.target.value)}
                        placeholder="Instrument (e.g., RELIANCE)"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.ex || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'ex', e.target.value)}
                        placeholder="Exchange"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.prod || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'prod', e.target.value)}
                        placeholder="Product"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.qty || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'qty', e.target.value)}
                        placeholder="Quantity"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.ltp || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'ltp', e.target.value)}
                        placeholder="LTP"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.price || ''}
                        onChange={(e) => handleOrderChange('openOrders', index, 'price', e.target.value)}
                        placeholder="Price"
                      />
                      <select
                        style={{ ...styles.input, flex: 1 }}
                        value={order.status || 'open'}
                        onChange={(e) => handleOrderChange('openOrders', index, 'status', e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        style={styles.removeButton}
                        onClick={() => removeOrder('openOrders', index)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    style={styles.addButton} 
                    onClick={() => addOrder('openOrders')}
                  >
                    ➕ Add Open Order
                  </button>
                </div>

                {/* Executed Orders Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subTitle}>✅ Executed Orders ({ordersData.executedOrders?.length || 0})</h3>
                  
                  {(ordersData.executedOrders || []).map((order, index) => (
                    <div key={order.id || index} style={styles.orderRow}>
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.t || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 't', e.target.value)}
                        placeholder="Time (e.g., 13:45:09)"
                      />
                      <select
                        style={{ ...styles.input, flex: 1 }}
                        value={order.type || 'buy'}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'type', e.target.value)}
                      >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                      </select>
                      <input
                        style={{ ...styles.input, flex: 2 }}
                        value={order.inst || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'inst', e.target.value)}
                        placeholder="Instrument (e.g., INFY)"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.ex || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'ex', e.target.value)}
                        placeholder="Exchange"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.prod || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'prod', e.target.value)}
                        placeholder="Product"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.qty || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'qty', e.target.value)}
                        placeholder="Quantity"
                      />
                      <input
                        style={{ ...styles.input, flex: 1 }}
                        value={order.avg || ''}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'avg', e.target.value)}
                        placeholder="Avg Price"
                      />
                      <select
                        style={{ ...styles.input, flex: 1 }}
                        value={order.status || 'complete'}
                        onChange={(e) => handleOrderChange('executedOrders', index, 'status', e.target.value)}
                      >
                        <option value="complete">Complete</option>
                        <option value="rejected">Rejected</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button
                        style={styles.removeButton}
                        onClick={() => removeOrder('executedOrders', index)}
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    style={styles.addButton} 
                    onClick={() => addOrder('executedOrders')}
                  >
                    ➕ Add Executed Order
                  </button>
                </div>

                <button
                  style={styles.saveButton}
                  onClick={saveOrdersData}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Orders Data'}
                </button>
              </>
            ) : (
              <div style={styles.loading}>Loading orders data...</div>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>👤 Account Management</h2>
              <div style={{...styles.badge, ...styles.successBadge}}>Live Data</div>
            </div>
            
            {accountData ? (
              <>
                {/* Personal Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subTitle}>📋 Personal Information</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Email</label>
                      <input
                        style={styles.input}
                        value={accountData.personal?.email || ''}
                        onChange={(e) => handleAccountChange('personal', 'email', e.target.value)}
                        placeholder="e.g., sahadsaad186@gmail.com"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Mobile</label>
                      <input
                        style={styles.input}
                        value={accountData.personal?.mobile || ''}
                        onChange={(e) => handleAccountChange('personal', 'mobile', e.target.value)}
                        placeholder="e.g., *6950"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>PAN</label>
                      <input
                        style={styles.input}
                        value={accountData.personal?.pan || ''}
                        onChange={(e) => handleAccountChange('personal', 'pan', e.target.value)}
                        placeholder="e.g., *182M"
                      />
                    </div>
                  </div>
                </div>

                {/* Demat Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subTitle}>🏦 Demat Information</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Demat ID</label>
                      <input
                        style={styles.input}
                        value={accountData.demat?.dematId || ''}
                        onChange={(e) => handleAccountChange('demat', 'dematId', e.target.value)}
                        placeholder="e.g., 1208160149854261"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>DP ID</label>
                      <input
                        style={styles.input}
                        value={accountData.demat?.dpId || ''}
                        onChange={(e) => handleAccountChange('demat', 'dpId', e.target.value)}
                        placeholder="e.g., 12081601"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>BO ID</label>
                      <input
                        style={styles.input}
                        value={accountData.demat?.boId || ''}
                        onChange={(e) => handleAccountChange('demat', 'boId', e.target.value)}
                        placeholder="e.g., 49854261"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Depository Participant</label>
                      <input
                        style={styles.input}
                        value={accountData.demat?.depositoryParticipant || ''}
                        onChange={(e) => handleAccountChange('demat', 'depositoryParticipant', e.target.value)}
                        placeholder="e.g., Zerodha Broking Limited"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Depository</label>
                      <input
                        style={styles.input}
                        value={accountData.demat?.depository || ''}
                        onChange={(e) => handleAccountChange('demat', 'depository', e.target.value)}
                        placeholder="e.g., CDSL"
                      />
                    </div>
                  </div>
                </div>

                {/* Verified P&L Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subTitle}>📊 Verified P&L Settings</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Name Display</label>
                      <select
                        style={styles.input}
                        value={accountData.verifiedPL?.nameDisplay || 'Full name'}
                        onChange={(e) => handleAccountChange('verifiedPL', 'nameDisplay', e.target.value)}
                      >
                        <option value="Full name">Full name</option>
                        <option value="Short name">Short name</option>
                        <option value="Masked">Masked</option>
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.useAvatar || false}
                          onChange={(e) => handleAccountChange('verifiedPL', 'useAvatar', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        Use Avatar Image
                      </label>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Description/Profile</label>
                      <textarea
                        style={{...styles.input, minHeight: '80px'}}
                        value={accountData.verifiedPL?.description || ''}
                        onChange={(e) => handleAccountChange('verifiedPL', 'description', e.target.value)}
                        placeholder="Optional description or profile"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Personal Webpage</label>
                      <input
                        style={styles.input}
                        value={accountData.verifiedPL?.personalWebpage || ''}
                        onChange={(e) => handleAccountChange('verifiedPL', 'personalWebpage', e.target.value)}
                        placeholder="Optional personal webpage URL"
                      />
                    </div>
                  </div>
                  
                  <div style={{marginTop: '20px'}}>
                    <h4 style={styles.subTitle}>Segments to Share</h4>
                    <div style={styles.checkboxGroup}>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.segments?.equity || false}
                          onChange={(e) => handleVerifiedPLSegmentChange('equity', e.target.checked)}
                        />
                        Equity
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.segments?.currency || false}
                          onChange={(e) => handleVerifiedPLSegmentChange('currency', e.target.checked)}
                        />
                        Currency
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.segments?.futuresOptions || false}
                          onChange={(e) => handleVerifiedPLSegmentChange('futuresOptions', e.target.checked)}
                        />
                        Futures & Options
                      </label>
                      <label style={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.segments?.commodity || false}
                          onChange={(e) => handleVerifiedPLSegmentChange('commodity', e.target.checked)}
                        />
                        Commodity
                      </label>
                    </div>
                  </div>

                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Timeline Days</label>
                      <select
                        style={styles.input}
                        value={accountData.verifiedPL?.timelineDays || 30}
                        onChange={(e) => handleAccountChange('verifiedPL', 'timelineDays', parseInt(e.target.value))}
                      >
                        <option value={7}>7 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                      </select>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.livePL || false}
                          onChange={(e) => handleAccountChange('verifiedPL', 'livePL', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        Live P&L (updates everyday)
                      </label>
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>
                        <input
                          type="checkbox"
                          checked={accountData.verifiedPL?.displayTrades || false}
                          onChange={(e) => handleAccountChange('verifiedPL', 'displayTrades', e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        Display Trades
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  style={styles.saveButton}
                  onClick={saveAccountData}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Account Data'}
                </button>
              </>
            ) : (
              <div style={styles.loading}>Loading account data...</div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📊 Console Management</h2>
              <p style={styles.description}>
                Manage P&L data, portfolio holdings, and other console page content
              </p>
            </div>
            
            {consoleData ? (
              <>
                {/* P&L Data Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subsectionTitle}>💰 P&L Data</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Realised Total (₹)</label>
                      <input
                        type="number"
                        value={consoleData.realisedTotal || 0}
                        onChange={(e) => handleConsoleInputChange('realisedTotal', parseFloat(e.target.value) || 0)}
                        style={styles.input}
                        placeholder="5700000"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Charges & Taxes (₹)</label>
                      <input
                        type="number"
                        value={consoleData.charges || 0}
                        onChange={(e) => handleConsoleInputChange('charges', parseFloat(e.target.value) || 0)}
                        style={styles.input}
                        placeholder="483.14"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Other Credits & Debits (₹)</label>
                      <input
                        type="number"
                        value={consoleData.otherCreditsDebits || 0}
                        onChange={(e) => handleConsoleInputChange('otherCreditsDebits', parseFloat(e.target.value) || 0)}
                        style={styles.input}
                        placeholder="-134.52"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Unrealised P&L (₹)</label>
                      <input
                        type="number"
                        value={consoleData.unrealisedPL || 0}
                        onChange={(e) => handleConsoleInputChange('unrealisedPL', parseFloat(e.target.value) || 0)}
                        style={styles.input}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio Data Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subsectionTitle}>📈 Portfolio Holdings</h3>
                  <div style={styles.portfolioContainer}>
                    {consoleData.portfolioData?.map((item, index) => (
                      <div key={index} style={styles.portfolioItem}>
                        <div style={styles.portfolioHeader}>
                          <h4 style={styles.portfolioTitle}>Stock #{index + 1}</h4>
                          <button
                            onClick={() => removePortfolioItem(index)}
                            style={styles.removeButton}
                          >
                            ❌ Remove
                          </button>
                        </div>
                        <div style={styles.formGrid}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Symbol</label>
                            <input
                              type="text"
                              value={item.symbol || ''}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { symbol: e.target.value }, index)}
                              style={styles.input}
                              placeholder="SBIN"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantity</label>
                            <input
                              type="number"
                              value={item.qty || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { qty: parseInt(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="10"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Buy Average (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.buyAvg || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { buyAvg: parseFloat(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="769.65"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Buy Value (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.buyVal || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { buyVal: parseFloat(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="7696.50"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Sell Average (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.sellAvg || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { sellAvg: parseFloat(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="802.00"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Sell Value (₹)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={item.sellVal || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { sellVal: parseFloat(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="8020.00"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Realised P&L Display</label>
                            <input
                              type="text"
                              value={item.realisedPL || ''}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { realisedPL: e.target.value }, index)}
                              style={styles.input}
                              placeholder="+₹8,55,000.00"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Realised Amount (₹)</label>
                            <input
                              type="number"
                              value={item.realisedAmount || 0}
                              onChange={(e) => handleConsoleInputChange('portfolioData', { realisedAmount: parseFloat(e.target.value) || 0 }, index)}
                              style={styles.input}
                              placeholder="855000"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={addPortfolioItem}
                      style={styles.addButton}
                    >
                      ➕ Add New Portfolio Item
                    </button>
                  </div>
                </div>

                {/* Date Settings Section */}
                <div style={styles.subsection}>
                  <h3 style={styles.subsectionTitle}>📅 Date Settings</h3>
                  <div style={styles.formGrid}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Date From</label>
                      <input
                        type="date"
                        value={consoleData.dateFrom || '2024-07-31'}
                        onChange={(e) => handleConsoleInputChange('dateFrom', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Date To</label>
                      <input
                        type="date"
                        value={consoleData.dateTo || '2025-09-27'}
                        onChange={(e) => handleConsoleInputChange('dateTo', e.target.value)}
                        style={styles.input}
                      />
                    </div>
                  </div>
                </div>

                <button
                  style={styles.saveButton}
                  onClick={() => updateConsoleData(consoleData)}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Console Data'}
                </button>
              </>
            ) : (
              <div style={styles.loading}>Loading console data...</div>
            )}
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📈 Portfolio Management</h2>
              <p style={styles.description}>
                Manage portfolio metrics, asset allocation, sector distribution, and stock holdings
              </p>
            </div>

            {portfolioData ? (
              <>
                {/* Portfolio Metrics Section */}
                <div style={styles.cardContainer}>
                  <h3 style={styles.subsectionTitle}>📊 Portfolio Metrics</h3>
                  <div style={styles.row}>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Invested Amount (₹)</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={portfolioData.metrics.invested || 0}
                        onChange={(e) => handlePortfolioInputChange('metrics', { invested: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Present Value (₹)</label>
                      <input
                        type="number"
                        style={styles.input}
                        value={portfolioData.metrics.present || 0}
                        onChange={(e) => handlePortfolioInputChange('metrics', { present: parseFloat(e.target.value) || 0 })}
                        step="0.01"
                      />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>XIRR URL</label>
                      <input
                        type="text"
                        style={styles.input}
                        value={portfolioData.metrics.xirrUrl || '#'}
                        onChange={(e) => handlePortfolioInputChange('metrics', { xirrUrl: e.target.value })}
                        placeholder="Enter XIRR URL"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Mix Section */}
                <div style={styles.cardContainer}>
                  <h3 style={styles.subsectionTitle}>🔄 Account Mix</h3>
                  <div style={styles.portfolioContainer}>
                    {portfolioData.accountMix?.map((item, index) => (
                      <div key={index} style={styles.portfolioItem}>
                        <div style={styles.portfolioHeader}>
                          <h4 style={styles.portfolioItemTitle}>Asset {index + 1}</h4>
                          <button
                            onClick={() => removePortfolioAccountMixItem(index)}
                            style={styles.removeButton}
                          >
                            ❌
                          </button>
                        </div>
                        <div style={styles.row}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Label</label>
                            <input
                              type="text"
                              style={styles.input}
                              value={item.label || ''}
                              onChange={(e) => handlePortfolioInputChange('accountMix', { label: e.target.value }, index)}
                              placeholder="Asset name"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Color</label>
                            <input
                              type="color"
                              style={styles.colorInput}
                              value={item.color || '#1d4ed8'}
                              onChange={(e) => handlePortfolioInputChange('accountMix', { color: e.target.value }, index)}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Percentage</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={item.pct || 0}
                              onChange={(e) => handlePortfolioInputChange('accountMix', { pct: parseFloat(e.target.value) || 0 }, index)}
                              step="0.01"
                              min="0"
                              max="1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addPortfolioAccountMixItem}
                      style={styles.addButton}
                    >
                      ➕ Add Account Mix Item
                    </button>
                  </div>
                </div>

                {/* Sectors Section */}
                <div style={styles.cardContainer}>
                  <h3 style={styles.subsectionTitle}>🏭 Sector Distribution</h3>
                  <div style={styles.portfolioContainer}>
                    {portfolioData.sectors?.map((item, index) => (
                      <div key={index} style={styles.portfolioItem}>
                        <div style={styles.portfolioHeader}>
                          <h4 style={styles.portfolioItemTitle}>Sector {index + 1}</h4>
                          <button
                            onClick={() => removePortfolioSectorItem(index)}
                            style={styles.removeButton}
                          >
                            ❌
                          </button>
                        </div>
                        <div style={styles.row}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Sector Name</label>
                            <input
                              type="text"
                              style={styles.input}
                              value={item.label || ''}
                              onChange={(e) => handlePortfolioInputChange('sectors', { label: e.target.value }, index)}
                              placeholder="Sector name"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Color</label>
                            <input
                              type="color"
                              style={styles.colorInput}
                              value={item.color || '#0b5bd3'}
                              onChange={(e) => handlePortfolioInputChange('sectors', { color: e.target.value }, index)}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Percentage</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={item.pct || 0}
                              onChange={(e) => handlePortfolioInputChange('sectors', { pct: parseFloat(e.target.value) || 0 }, index)}
                              step="0.01"
                              min="0"
                              max="1"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addPortfolioSectorItem}
                      style={styles.addButton}
                    >
                      ➕ Add Sector
                    </button>
                  </div>
                </div>

                {/* Stock Holdings Section */}
                <div style={styles.cardContainer}>
                  <h3 style={styles.subsectionTitle}>📈 Stock Holdings</h3>
                  <div style={styles.portfolioContainer}>
                    {portfolioData.stocks?.rows?.map((stock, index) => (
                      <div key={index} style={styles.portfolioItem}>
                        <div style={styles.portfolioHeader}>
                          <h4 style={styles.portfolioItemTitle}>{stock.instrument || `Stock ${index + 1}`}</h4>
                          <button
                            onClick={() => removePortfolioStockRow(index)}
                            style={styles.removeButton}
                          >
                            ❌
                          </button>
                        </div>
                        <div style={styles.row}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Instrument</label>
                            <input
                              type="text"
                              style={styles.input}
                              value={stock.instrument || ''}
                              onChange={(e) => handlePortfolioInputChange('stocks', { instrument: e.target.value }, index, 'rows')}
                              placeholder="Stock symbol"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantity</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.qty || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { qty: parseInt(e.target.value) || 0 }, index, 'rows')}
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Avg Price (₹)</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.avgPrice || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { avgPrice: parseFloat(e.target.value) || 0 }, index, 'rows')}
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div style={styles.row}>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>LTP (₹)</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.ltp || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { ltp: parseFloat(e.target.value) || 0 }, index, 'rows')}
                              step="0.01"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>P&L (₹)</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.pnl || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { pnl: parseFloat(e.target.value) || 0 }, index, 'rows')}
                              step="0.01"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Net Change (%)</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.netChg || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { netChg: parseFloat(e.target.value) || 0 }, index, 'rows')}
                              step="0.01"
                            />
                          </div>
                          <div style={styles.inputGroup}>
                            <label style={styles.label}>Day Change (%)</label>
                            <input
                              type="number"
                              style={styles.input}
                              value={stock.dayChg || 0}
                              onChange={(e) => handlePortfolioInputChange('stocks', { dayChg: parseFloat(e.target.value) || 0 }, index, 'rows')}
                              step="0.01"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addPortfolioStockRow}
                      style={styles.addButton}
                    >
                      ➕ Add Stock
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => updatePortfolioData(portfolioData)}
                  disabled={saving}
                  style={{
                    ...styles.button,
                    ...(saving ? styles.buttonDisabled : {}),
                    width: '100%',
                    marginTop: '20px'
                  }}
                >
                  {saving ? 'Updating Portfolio...' : 'Update Portfolio Data'}
                </button>
              </>
            ) : (
              <div style={styles.loading}>Loading portfolio data...</div>
            )}
          </div>
        )}

        {activeTab === 'userInfo' && (
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>👤 User Info Settings</h2>
            </div>
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
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📊 Holdings Detail Management</h2>
              <div style={{...styles.badge, ...styles.successBadge}}>Live Data</div>
            </div>
            
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
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Instrument</div>
                      <input
                        style={styles.input}
                        value={holding.instrument}
                        onChange={(e) => handleHoldingItemChange(index, 'instrument', e.target.value)}
                        placeholder="Instrument"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Qty</div>
                      <input
                        style={styles.input}
                        type="number"
                        value={holding.qty}
                        onChange={(e) => handleHoldingItemChange(index, 'qty', parseInt(e.target.value))}
                        placeholder="Qty"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Avg Cost</div>
                      <input
                        style={styles.input}
                        value={holding.avgCost}
                        onChange={(e) => handleHoldingItemChange(index, 'avgCost', e.target.value)}
                        placeholder="Avg Cost"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>LTP</div>
                      <input
                        style={styles.input}
                        value={holding.ltp}
                        onChange={(e) => handleHoldingItemChange(index, 'ltp', e.target.value)}
                        placeholder="LTP"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Current Value</div>
                      <input
                        style={styles.input}
                        value={holding.curVal}
                        onChange={(e) => handleHoldingItemChange(index, 'curVal', e.target.value)}
                        placeholder="Current Value"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>P&L</div>
                      <input
                        style={styles.input}
                        value={holding.pnl}
                        onChange={(e) => handleHoldingItemChange(index, 'pnl', e.target.value)}
                        placeholder="P&L"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Net Change</div>
                      <input
                        style={styles.input}
                        value={holding.netChg}
                        onChange={(e) => handleHoldingItemChange(index, 'netChg', e.target.value)}
                        placeholder="Net Change"
                      />
                    </div>
                    <div style={styles.inputWithLabel}>
                      <div style={styles.mobileLabel}>Day Change</div>
                      <input
                        style={styles.input}
                        value={holding.dayChg}
                        onChange={(e) => handleHoldingItemChange(index, 'dayChg', e.target.value)}
                        placeholder="Day Change"
                      />
                    </div>
                  </div>
                  <button
                    style={styles.removeButton}
                    onClick={() => removeHoldingItem(index)}
                    title="Remove holding"
                  >
                    🗑️
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
          <div className="admin-section" style={styles.section}>
            <div style={styles.cardHeader}>
              <h2 style={styles.sectionTitle}>📈 Positions Detail Management</h2>
              <div style={{...styles.badge, ...styles.successBadge}}>Live Data</div>
            </div>
            
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
      </div>
      </div>
    </div>
  );
};

const styles = {
  // sectionCard duplicate removed; only the improved version remains
  formGridBetter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  inputGroupBetter: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  labelBetter: {
    fontWeight: 600,
    color: '#334155',
    fontSize: '1.05rem',
    marginBottom: '0.25rem',
  },
  inputBetter: {
    padding: '0.9rem 1.1rem',
    borderRadius: '0.75rem',
    border: '1.5px solid #cbd5e1',
    fontSize: '1.1rem',
    background: '#f8fafc',
    color: '#1e293b',
    outline: 'none',
    transition: 'border 0.2s',
    boxShadow: '0 1px 2px rgba(30,41,59,0.03)',
    marginBottom: '0.1rem',
  },
  saveButtonBetter: {
    width: '100%',
    padding: '1.1rem 0',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.15rem',
    border: 'none',
    borderRadius: '0.75rem',
    boxShadow: '0 2px 8px 0 rgba(30,41,59,0.07)',
    cursor: 'pointer',
    marginTop: '1.5rem',
    transition: 'background 0.18s',
  },
  container: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: '1.6',
    display: 'flex',
    flexDirection: 'column',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    minHeight: 'calc(100vh - 80px)',
    '@media (max-width: 900px)': {
      gridTemplateColumns: '1fr',
    },
    position: 'relative',
  },
  sidebarBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(30,41,59,0.25)',
    zIndex: 19,
    transition: 'opacity 0.2s',
  },
  contentMobileWrap: {
    width: '100%',
    maxWidth: '100vw',
    padding: '1.2rem 0.5rem 2.5rem 0.5rem',
    margin: 0,
    overflowX: 'auto',
    minHeight: 'calc(100vh - 64px)',
    boxSizing: 'border-box',
    transition: 'margin-left 0.2s',
    '@media (min-width: 900px)': {
      padding: '2rem 2.5rem',
      marginLeft: '220px', // match sidebar width
      maxWidth: 'calc(100vw - 220px)',
    },
  },
  sectionCard: {
    background: '#fff',
    borderRadius: '1.25rem',
    boxShadow: '0 2px 16px 0 rgba(30,41,59,0.07)',
    padding: '2.5rem 2rem 2rem 2rem',
    margin: '2rem 0',
    maxWidth: '700px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '1px solid #e2e8f0',
    boxSizing: 'border-box',
  },
  topbar: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '1rem',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 10,
    minHeight: '64px',
  },
  headerContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.25rem',
    marginLeft: '1rem',
  },
  sidebar: {
    backgroundColor: '#fff',
    borderRight: '1px solid #e2e8f0',
    padding: '1.5rem 1rem 1rem 1rem',
    minWidth: '200px',
    maxWidth: '240px',
    height: '100%',
    position: 'relative',
    transition: 'transform 0.3s ease',
    zIndex: 20,
    overflowY: 'auto',
    overflowX: 'hidden',
    '@media (max-width: 900px)': {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      transform: 'translateX(-100%)',
      boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
      backgroundColor: '#fff',
      maxWidth: '80vw',
      overflowY: 'auto',
      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
    },
  },
  sidebarOpen: {
    '@media (max-width: 900px)': {
      transform: 'translateX(0)',
    },
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  sidebarClose: {
    display: 'none',
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#64748b',
    cursor: 'pointer',
    '@media (max-width: 900px)': {
      display: 'block',
    },
  },
  sidebarNavList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  sidebarNavButton: {
    width: '100%',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    color: '#334155',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  sidebarNavButtonActive: {
    background: '#e0e7ef',
    color: '#2563eb',
    fontWeight: 700,
  },
  sidebarToggle: {
    display: 'none',
  },
  sidebarFabOpen: {
    position: 'fixed',
    top: '1.1rem',
    left: '1.1rem',
    zIndex: 30,
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.15s',
    '@media (min-width: 900px)': {
      display: 'none',
    },
  },
  previewButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '2rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    marginRight: '1rem',
  },
  previewIcon: {
    fontSize: '1.2rem',
    filter: 'brightness(1.1)',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f1f5f9',
    padding: '1rem',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    backgroundColor: '#fff',
    padding: '1.5rem 1rem',
    borderBottom: '1px solid #e2e8f0',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    '@media (min-width: 768px)': {
      padding: '2rem',
    },
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#1e293b',
    margin: '0 0 0.5rem 0',
    '@media (min-width: 768px)': {
      fontSize: '2.5rem',
    },
  },
  subtitle: {
    fontSize: '0.975rem',
    color: '#64748b',
    margin: '0',
    '@media (min-width: 768px)': {
      fontSize: '1.1rem',
    },
  },
  message: {
    marginTop: '1rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    fontWeight: '500',
    display: 'inline-block',
    fontSize: '0.875rem',
    maxWidth: '90%',
    textAlign: 'center',
    '@media (min-width: 768px)': {
      fontSize: '1rem',
      maxWidth: 'none',
    },
  },
  // ...rest of the original styles object...
  tabContainer: {
    backgroundColor: '#fff',
    padding: '0 0.5rem',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    gap: '0.25rem',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
    '@media (min-width: 768px)': {
      padding: '0 2rem',
      gap: '0.5rem',
      overflowX: 'visible',
    },
  },
  // ...keep all other style definitions as before...
  // Removed duplicate keys: loadingContainer, spinner, header, title, subtitle, message, tabContainer
  tab: {
    padding: '0.75rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#64748b',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    transition: 'all 0.2s ease',
    fontSize: '0.875rem',
    whiteSpace: 'nowrap',
    minWidth: 'fit-content',
    '@media (min-width: 768px)': {
      padding: '1rem 1.5rem',
      fontSize: '1rem',
    },
  },
  activeTab: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: '1rem',
    '@media (min-width: 768px)': {
      padding: '2rem',
    },
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f1f5f9',
    '@media (min-width: 768px)': {
      padding: '2rem',
    },
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '@media (min-width: 768px)': {
      fontSize: '1.5rem',
    },
  },
  subTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#374151',
    marginTop: '2rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f1f5f9',
    '@media (min-width: 768px)': {
      fontSize: '1.2rem',
    },
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1rem',
    marginBottom: '2rem',
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1.5rem',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
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
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  input: {
    padding: '0.875rem',
    border: '2px solid #e2e8f0',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    outline: 'none',
    backgroundColor: '#fff',
    '&:focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    },
    '&:hover': {
      borderColor: '#cbd5e1',
    },
  },
  positionRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '1rem',
    },
  },
  orderRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#f8fafc',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    '@media (min-width: 768px)': {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '0.5rem',
    },
  },
  checkboxGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '0.5rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    cursor: 'pointer',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '0.75rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
    width: '100%',
    '@media (min-width: 640px)': {
      width: 'auto',
    },
    '&:hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)',
      boxShadow: '0 6px 8px -1px rgba(59, 130, 246, 0.4)',
    },
    '&:active': {
      transform: 'translateY(0)',
    },
  },
  addButton: {
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
    width: '100%',
    '@media (min-width: 640px)': {
      width: 'auto',
    },
    '&:hover': {
      backgroundColor: '#059669',
      transform: 'translateY(-1px)',
    },
  },
  removeButton: {
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontSize: '0.75rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    minWidth: '60px',
    '&:hover': {
      backgroundColor: '#dc2626',
      transform: 'scale(1.05)',
    },
  },
  subsection: {
    marginBottom: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8fafc',
    borderRadius: '1rem',
    border: '2px solid #e2e8f0',
    '@media (min-width: 768px)': {
      padding: '2rem',
    },
  },
  holdingRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '0.75rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    '@media (min-width: 1024px)': {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    '&:hover': {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-1px)',
    },
  },
  holdingGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '0.75rem',
    flex: 1,
    '@media (min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '1rem',
    },
    '@media (min-width: 768px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
    '@media (min-width: 1280px)': {
      gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 1fr 1fr 1fr',
      gap: '0.5rem',
    },
  },
  mobileLabel: {
    fontSize: '0.75rem',
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: '0.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    '@media (min-width: 1280px)': {
      display: 'none',
    },
  },
  inputWithLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '2px solid #f1f5f9',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  successBadge: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  errorBadge: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
  },
  portfolioContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  portfolioItem: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '0.75rem',
    padding: '1rem',
  },
  portfolioHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  portfolioTitle: {
    margin: '0',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
  },
};

// Add CSS for animations and responsive utilities
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  /* ==== Force white background & readable surfaces ==== */
html, body, .admin-dashboard {
  background: #ffffff !important;
  color: #0f172a !important;
}
:root {
  --bg: #ffffff;
  --surface: #ffffff;
  --surface-2: #ffffff;
  --text: #0f172a;
  --text-muted: #475569;
  --border: #e2e8f0;
  --primary: #2563eb;
  --primary-700: #1d4ed8;
  --success: #10b981;
  --danger: #ef4444;
  --ring: rgba(37,99,235,.18);
}
.admin-dashboard .topbar {
  background: #ffffff !important;
  border-bottom: 1px solid var(--border) !important;
}

/* Cards/sections on white */
.admin-dashboard .section,
.admin-dashboard .sectionCard,
.admin-dashboard .admin-section,
.admin-dashboard .subsection,
.admin-dashboard .portfolioItem,
.admin-dashboard .orderRow,
.admin-dashboard .positionRow,
.admin-dashboard .holdingRow {
  background: #ffffff !important;
  border: 1px solid var(--border) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 24px rgba(2,6,23,.06) !important;
}
.admin-dashboard .cardHeader {
  border-bottom: 1px solid var(--border) !important;
}
.admin-dashboard label { color: var(--text-muted) !important; }

/* Inputs: solid white (prevents dark/autofill overlays) */
.admin-dashboard input,
.admin-dashboard select,
.admin-dashboard textarea {
  background: #ffffff !important;
  color: var(--text) !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
  padding: .8rem 1rem !important;
  box-shadow: none !important;
}
.admin-dashboard input:focus,
.admin-dashboard select:focus,
.admin-dashboard textarea:focus {
  outline: none !important;
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 4px var(--ring) !important;
}

/* ==== Mobile full-width fix (prevents “half page”) ==== */
/* Your inline React styles set grid-template-columns on .layoutGrid.
   Override it on mobile to collapse to one column and hide the sidebar off-canvas. */
@media (max-width: 899px) {
  /* Collapse the grid entirely on mobile */
  .admin-dashboard .layoutGrid {
    display: block !important;           /* ignore the inline grid */
  }

  /* Make content area span the full viewport width */
  .admin-dashboard .contentMobileWrap,
  .admin-dashboard .content {
    margin-left: 0 !important;
    width: 100% !important;
    max-width: 100vw !important;
    padding: 1rem !important;
    overflow-x: hidden !important;
  }

  /* Sidebar as hidden drawer */
  .admin-sidebar {
    position: fixed !important;
    left: 0; top: 0;
    height: 100vh !important;
    width: 80vw !important;
    max-width: 320px !important;
    transform: translateX(-100%) !important;
    background: #ffffff !important;
    border-right: 1px solid var(--border) !important;
    z-index: 110 !important;
  }
  .admin-sidebar.open { transform: translateX(0) !important; }

  /* Backdrop above content when sidebar is open */
  .admin-dashboard .sidebarBackdrop { 
    z-index: 100 !important;
    backdrop-filter: blur(2px);
  }

  /* Extra safety: if any inline style still forces two columns, nuke it */
  .admin-dashboard [style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}

/* ==== Desktop: keep sidebar fixed and push content (no overlap) ==== */
@media (min-width: 900px) {
  .admin-sidebar {
    position: fixed !important;
    left: 0; top: 64px;
    height: calc(100vh - 64px) !important;
    width: 220px !important;
    transform: none !important;
    background: #ffffff !important;
    border-right: 1px solid var(--border) !important;
    z-index: 90 !important;
  }
  .admin-dashboard .contentMobileWrap {
    margin-left: 220px !important;
    max-width: calc(100vw - 220px) !important;
    padding: 2rem !important;
  }
  .admin-dashboard .layoutGrid {
    grid-template-columns: 220px 1fr !important;
  }
}

/* Preview Button Hover Effects */
.admin-dashboard button[style*="linear-gradient"]:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4) !important;
  background: linear-gradient(135deg, #5a6fd8 0%, #6b46a3 100%) !important;
}

.admin-dashboard button[style*="linear-gradient"]:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
}

/* Buttons on white */
.admin-dashboard .saveButton,
.admin-dashboard .saveButtonBetter,
.admin-dashboard .button {
  background: var(--primary) !important;
  color: #fff !important;
  border: 1px solid transparent !important;
}
.admin-dashboard .saveButton:hover,
.admin-dashboard .saveButtonBetter:hover,
.admin-dashboard .button:hover { background: var(--primary-700) !important; }
.admin-dashboard .addButton { background: var(--success) !important; color: #fff !important; border: 1px solid transparent !important; }
.admin-dashboard .removeButton { background: var(--danger) !important; color: #fff !important; border: 1px solid transparent !important; }

/* ==== DESKTOP FIX (>=900px): show content next to fixed sidebar ==== */
@media (min-width: 900px) {
  /* Drop the grid on desktop to avoid double-offset with a fixed sidebar */
  .admin-dashboard .layoutGrid {
    display: block !important;                 /* replaces the 220px + 1fr grid */
  }

  /* Keep the sidebar fixed and visible */
  .admin-sidebar {
    position: fixed !important;
    left: 0; top: 64px;                         /* matches your topbar height */
    width: 220px !important;
    min-width: 220px !important;
    max-width: 220px !important;
    height: calc(100vh - 64px) !important;
    transform: none !important;
    background: #ffffff !important;
    border-right: 1px solid var(--border) !important;
    z-index: 90 !important;
  }

  /* Make the main content occupy the rest of the screen */
  .admin-dashboard .contentMobileWrap,
  .admin-dashboard .content {
    display: block !important;
    margin-left: 220px !important;              /* clear the fixed sidebar */
    width: calc(100vw - 220px) !important;
    max-width: calc(100vw - 220px) !important;
    padding: 2rem !important;
    min-height: calc(100vh - 64px) !important;  /* ensure it isn’t “0px tall” */
    overflow: visible !important;
  }

  /* Safety net: if any inline style still imposes grid columns, neutralize it */
  .admin-dashboard [style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}

  
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;