import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Menu = React.memo(() => {
  const [selectedMenu, SetSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, SetIsProfileDropdownOpen] = useState(false);
  const [privacyOn, setPrivacyOn] = useState(true);
  const [marketData, setMarketData] = useState([
    { name: "NIFTY 50", last: "24658.84", change: "-232.01", pct: "(-0.93%)", isPositive: false },
    { name: "SENSEX", last: "80426.01", change: "-733.67", pct: "(-0.90%)", isPositive: false },
  ]);
  const { logout } = useAuth();

  const handleMenuClick = useCallback((index) => SetSelectedMenu(index), []);
  const handleProfileClick = useCallback(
    () => SetIsProfileDropdownOpen(!isProfileDropdownOpen),
    [isProfileDropdownOpen]
  );

  const fetchMarketData = useCallback(async () => {
    try {
      const promises = [
        fetch('http://localhost:3000/api/stocks/stock/^NSEI').catch(() => null),
        fetch('http://localhost:3000/api/stocks/stock/^BSESN').catch(() => null),
      ];

      const [niftyResponse, sensexResponse] = await Promise.all(promises);
      
      let niftyData = null;
      let sensexData = null;
      
      if (niftyResponse) {
        niftyData = await niftyResponse.json();
      }
      
      if (sensexResponse) {
        sensexData = await sensexResponse.json();
      }

      // Use real data if available, otherwise keep default values
      const updates = [];
      
      if (niftyData?.chart?.result?.[0]) {
        const result = niftyData.chart.result[0];
        const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
        const previousClose = result.meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        updates.push({
          name: "NIFTY 50",
          last: currentPrice.toFixed(2),
          change: change.toFixed(2),
          pct: `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
          isPositive: change >= 0
        });
      } else {
        updates.push(marketData[0]);
      }
      
      if (sensexData?.chart?.result?.[0]) {
        const result = sensexData.chart.result[0];
        const currentPrice = result.meta.regularMarketPrice || result.meta.previousClose;
        const previousClose = result.meta.previousClose;
        const change = currentPrice - previousClose;
        const changePercent = (change / previousClose) * 100;
        
        updates.push({
          name: "SENSEX",
          last: currentPrice.toFixed(2),
          change: change.toFixed(2),
          pct: `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`,
          isPositive: change >= 0
        });
      } else {
        updates.push(marketData[1]);
      }
      
      setMarketData(updates);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  }, [marketData]);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, [fetchMarketData]);

  // ====== existing memo styles (unchanged where not necessary) ======
  const navWrap = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "0 32px",
      borderBottom: "1px solid #eee",
      background: "#fff",
      maxWidth: "2000px",
      margin: "0 auto",
      height: "50px",
      justifyContent: "space-between",
    }),
    []
  );

  const marketDataWrap = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 24,
      minWidth: "320px",
      marginLeft: "8px", // Move it a little to the right
    }),
    []
  );

  const marketItemStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "baseline",
      gap: 6,
      fontSize: "12px",
    }),
    []
  );

  const marketNameStyle = useMemo(
    () => ({
      fontWeight: 600,
      color: "#333",
      textTransform: "uppercase",
      fontSize: "11px",
    }),
    []
  );

  const marketPriceStyle = useMemo(() => ({
    fontWeight: 700,
    fontSize: "13px",
    fontFamily: "monospace",
  }), []);

  const marketChangeStyle = useMemo(() => ({
    fontSize: "10px",
    fontWeight: 600,
    fontFamily: "monospace",
  }), []);

  const centerWrap = useMemo(
    () => ({ flex: 1, display: "flex", justifyContent: "center" }),
    []
  );

  const ul = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 36,
      listStyle: "none",
      margin: 0,
      padding: 0,
    }),
    []
  );

  const baseItem = useMemo(
    () => ({ margin: 0, fontSize: 16, color: "#4a4a4a", fontWeight: 500 }),
    []
  );

  const activeItem = useMemo(
    () => ({ ...baseItem, color: "#ff5b2e", fontWeight: 700 }),
    [baseItem]
  );

  const rightWrap = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 18,
      position: "relative", // so dropdown anchors to this block
    }),
    []
  );

  const iconBtn = useMemo(
    () => ({
      width: 20,
      height: 20,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const avatar = useMemo(
    () => ({
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "rgba(94, 99, 255, 0.12)",
      color: "#5E63FF",
      fontSize: 11,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }),
    []
  );

  const logoStyle = useMemo(() => ({ width: 28, height: "auto" }), []);
  const linkStyle = useMemo(() => ({ textDecoration: "none" }), []);
  const profileStyle = useMemo(
    () => ({ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }),
    []
  );
  const usernameStyle = useMemo(
    () => ({ margin: 0, fontSize: 16, color: "#4a4a4a", fontWeight: 600 }),
    []
  );

  // ====== dropdown specific styles (to match screenshot) ======
  const dropdownStyle = useMemo(
    () => ({
      position: "absolute",
      top: 44,
      right: 0,
      background: "#fff",
      border: "1px solid #e9ecef",
      borderRadius: 6,
      boxShadow: "0 10px 28px rgba(0,0,0,.08)",
      width: 260,
      overflow: "hidden",
      zIndex: 1000,
      fontFamily:
        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    }),
    []
  );
  const ddHeader = useMemo(
    () => ({
      padding: "12px 14px",
      borderBottom: "1px solid #f1f3f5",
    }),
    []
  );
  const ddName = useMemo(
    () => ({ margin: 0, fontSize: 14, fontWeight: 600, color: "#2f3337" }),
    []
  );
  const ddEmail = useMemo(
    () => ({ margin: "2px 0 0", fontSize: 12, color: "#6f7680" }),
    []
  );
  const ddRow = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 14px",
      borderBottom: "1px solid #f6f7f8",
      fontSize: 13,
      color: "#2f3337",
    }),
    []
  );
  const ddList = useMemo(
    () => ({ listStyle: "none", margin: 0, padding: 0 }),
    []
  );
  const ddItem = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 14px",
      cursor: "pointer",
      fontSize: 13,
      color: "#2f3337",
    }),
    []
  );
  const ddDivider = useMemo(
    () => ({ height: 1, background: "#f1f3f5", margin: 0 }),
    []
  );
  const smallIcon = useMemo(
    () => ({
      width: 16,
      height: 16,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#6f7680",
      flex: "0 0 auto",
    }),
    []
  );
  const toggleWrap = useMemo(
    () => ({ display: "inline-flex", alignItems: "center", gap: 8 }),
    []
  );
  const toggle = useMemo(
    () => ({
      width: 34,
      height: 18,
      borderRadius: 20,
      background: privacyOn ? "#e9ecef" : "#e9ecef",
      position: "relative",
      cursor: "pointer",
    }),
    [privacyOn]
  );
  const knob = useMemo(
    () => ({
      position: "absolute",
      top: 2,
      left: privacyOn ? 18 : 2,
      width: 14,
      height: 14,
      background: "#adb5bd",
      borderRadius: "50%",
      transition: "left .15s ease",
    }),
    [privacyOn]
  );

  return (
    <div className="menu-container" style={navWrap}>
      {/* Left: Market Data */}
      <div style={marketDataWrap}>
        {marketData.map((item, index) => (
          <div key={item.name} style={marketItemStyle}>
            <span style={marketNameStyle}>{item.name}</span>
            <span 
              style={{ 
                ...marketPriceStyle, 
                color: item.isPositive ? "#4caf50" : "#e53935" 
              }}
            >
              {item.last}
            </span>
            <span 
              style={{ 
                ...marketChangeStyle, 
                color: item.isPositive ? "#4caf50" : "#e53935" 
              }}
            >
              {item.change} {item.pct}
            </span>
          </div>
        ))}
      </div>

      {/* Center: Menus */}
      <div className="menus" style={centerWrap}>
        <ul style={ul}>
          <li>
            <Link to="/" style={linkStyle} onClick={() => handleMenuClick(0)}>
              <p className={selectedMenu === 0 ? "menu selected" : "menu"} style={selectedMenu === 0 ? activeItem : baseItem}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link to="/orders" style={linkStyle} onClick={() => handleMenuClick(1)}>
              <p className={selectedMenu === 1 ? "menu selected" : "menu"} style={selectedMenu === 1 ? activeItem : baseItem}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link to="/holdings" style={linkStyle} onClick={() => handleMenuClick(2)}>
              <p className={selectedMenu === 2 ? "menu selected" : "menu"} style={selectedMenu === 2 ? activeItem : baseItem}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link to="/positions" style={linkStyle} onClick={() => handleMenuClick(3)}>
              <p className={selectedMenu === 3 ? "menu selected" : "menu"} style={selectedMenu === 3 ? activeItem : baseItem}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link to="/bids" style={linkStyle} onClick={() => handleMenuClick(4)}>
              <p className={selectedMenu === 4 ? "menu selected" : "menu"} style={selectedMenu === 4 ? activeItem : baseItem}>
                Bids
              </p>
            </Link>
          </li>
          <li>
            <Link to="/funds" style={linkStyle} onClick={() => handleMenuClick(5)}>
              <p className={selectedMenu === 5 ? "menu selected" : "menu"} style={selectedMenu === 5 ? activeItem : baseItem}>
                Funds
              </p>
            </Link>
          </li>
        </ul>
      </div>

      {/* Right: Icons + Profile */}
      <div style={rightWrap}>
        <span style={iconBtn} title="Cart" aria-label="Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6h15l-1.5 7.5H8L6 3H3" stroke="#4a4a4a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="10" cy="20" r="1.3" fill="#4a4a4a" />
            <circle cx="18" cy="20" r="1.3" fill="#4a4a4a" />
          </svg>
        </span>

        <span style={iconBtn} title="Alerts" aria-label="Alerts">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 16H6l1.2-1.6A6 6 0 0 0 8 11V9a4 4 0 1 1 8 0v2c0 1.1.36 2.17 1.03 3.04L18 16z" stroke="#4a4a4a" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            <path d="M10 18a2 2 0 0 0 4 0" stroke="#4a4a4a" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>

        <div className="profile" onClick={handleProfileClick} style={profileStyle}>
          <div className="avatar" style={avatar}>MS</div>
          <p className="username" style={usernameStyle}>FJP018</p>
        </div>

        {isProfileDropdownOpen && (
          <div style={dropdownStyle}>
            {/* Header with name/email + small edit icon (decorative) */}
            <div style={ddHeader}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={ddName}>Mahammad Sayad</p>
                  <p style={ddEmail}>sahadsaad186@gmail.com</p>
                </div>
                <span title="Edit" style={{ color: "#6f7680", cursor: "pointer" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="#6f7680" strokeWidth="1.2" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Privacy mode row */}
            <div style={ddRow}>
              <span style={{ color: "#6f7680" }}>Privacy mode</span>
              <span
                role="switch"
                aria-checked={privacyOn}
                onClick={() => setPrivacyOn((v) => !v)}
                style={toggleWrap}
              >
                <span style={toggle}>
                  <span style={knob} />
                </span>
              </span>
            </div>

            {/* Menu items */}
            <ul style={ddList}>
              <li>
                <a href="/console" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
                  
                    <span>Console</span>
                  </div>
                </a>
              </li>
              <li>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
               
                    <span>Coin</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
                   
                    <span>Support</span>
                  </div>
                </Link>
              </li>

              <hr style={ddDivider} />

              <li>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
                    
                    <span>Invite friends</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
                    
                    <span>Keyboard shortcuts</span>
                  </div>
                </Link>
              </li>
              <li>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <div style={ddItem}>
                
                    <span>User manual</span>
                  </div>
                </Link>
              </li>

              <hr style={ddDivider} />

              <li>
                <div style={ddItem} onClick={logout}>
                  
                  <span>Logout</span>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
});

export default Menu;
