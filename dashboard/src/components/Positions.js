import React, { useState, useEffect } from "react";

// Dynamic positions component that fetches data from backend
export default function Positions() {
  const [positionsData, setPositionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceChanges, setPriceChanges] = useState({});

  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPositionsData();
  }, []);

  // Real-time price fluctuation effect
  useEffect(() => {
    if (!positionsData) return;

    const interval = setInterval(() => {
      setPositionsData(prevData => {
        if (!prevData || !prevData.positions) return prevData;

        const updatedPositions = prevData.positions.map(position => {
          const currentLtp = parseFloat(position.ltp.toString().replace(/[^0-9.-]/g, ''));
          const avgPrice = parseFloat(position.avg.toString().replace(/[^0-9.-]/g, ''));
          
          // Generate small fluctuation (±0.5% to ±2%) but keep it profitable
          const fluctuationPercent = (Math.random() * 3.5 + 0.5) / 100; // 0.5% to 4%
          const isUp = Math.random() > 0.3; // 70% chance of going up to maintain profits
          
          let newLtp;
          if (isUp) {
            newLtp = currentLtp * (1 + fluctuationPercent);
          } else {
            // Ensure it doesn't go below average price (to maintain profit)
            const minPrice = avgPrice * 1.01; // At least 1% profit
            newLtp = Math.max(currentLtp * (1 - fluctuationPercent), minPrice);
          }

          // Calculate new P&L
          const qty = parseInt(position.qty.toString().replace(/[^0-9-]/g, ''));
          const newPnl = (newLtp - avgPrice) * Math.abs(qty);
          const newPnlPercent = ((newLtp - avgPrice) / avgPrice) * 100;

          // Track price change direction for visual indicators
          const priceDirection = newLtp > currentLtp ? 'up' : newLtp < currentLtp ? 'down' : 'same';
          
          setPriceChanges(prev => ({
            ...prev,
            [position.instrument]: {
              direction: priceDirection,
              timestamp: Date.now()
            }
          }));

          return {
            ...position,
            ltp: newLtp.toFixed(2),
            pnl: `${newPnl >= 0 ? '+' : ''}${newPnl.toFixed(2)}`,
            chg: `${newPnlPercent >= 0 ? '+' : ''}${newPnlPercent.toFixed(2)}%`
          };
        });

        // Recalculate total P&L
        const totalPnl = updatedPositions.reduce((sum, pos) => {
          const pnl = parseFloat(pos.pnl.toString().replace(/[^0-9.-]/g, ''));
          return sum + pnl;
        }, 0);

        return {
          ...prevData,
          positions: updatedPositions,
          totals: {
            ...prevData.totals,
            totalPnl: `${totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}`
          }
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [positionsData]);

  const fetchPositionsData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/positions`);
      const data = await response.json();
      setPositionsData(data);
    } catch (error) {
      console.error('Error fetching positions data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading positions...</div>;
  }

  if (!positionsData) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No positions data available</div>;
  }

  const rows = positionsData.positions;
  const breakdown = positionsData.breakdown;

  return (
    <div style={{ fontFamily: font, fontWeight: 400, color: "#2f3337" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        .title { margin:0; font-size:18px; color:#3a3f45; font-weight:400; }
        .tools { display:flex; align-items:center; gap:14px; }
        .search { display:flex; align-items:center; gap:8px; border:1px solid #e9ecef; border-radius:4px; padding:6px 8px; color:#6f7680; font-size:13px; min-width:210px; background:#fff; }
        .link { color:#2f6bd7; font-size:13px; text-decoration:none; cursor:pointer; }
        .link.orange { color:#ff6a3d; }
        .tableWrap { border-top:1px solid #f0f2f4; }
        table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }
        th { text-align:left; padding:12px 12px; color:#8a9097; font-weight:400; }
        td { padding:12px 12px; border-top:1px solid #f4f5f6; vertical-align:middle; font-weight:400; }
        td.right { text-align:right; }
        td.gray { background:#f8f9fb; }
        .pill { font-size:11px; border-radius:4px; padding:4px 8px; display:inline-block; }
        .pill.nrml { color:#3f76ff; background:#eaf0ff; }
        .pill.mis { color:#9aa1a8; background:#eceff3; }
        .pill.cnc { color:#ff8c4e; background:#fff1e6; }
        .pill.holding { color:#a8842a; background:#fff4cf; padding:2px 6px; margin-left:6px; }
        .muted { color:#9aa1a8; font-size:11px; margin-left:6px; }
        .loss { color:#e04f3d; }
        .profit { color:#1aa774; }
        .price-up { color: #1aa774; transition: all 0.3s ease; }
        .price-down { color: #e04f3d; transition: all 0.3s ease; }
        .price-arrow { font-size: 10px; margin-left: 4px; }

      `}</style>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <h3 className="title">Positions ({positionsData.count})</h3>
        <div className="tools">
          <div className="search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6"/><path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <span>Search</span>
          </div>
          <span className="link orange" style={{cursor: 'pointer'}}>Analyze</span>
          <span className="link" style={{cursor: 'pointer'}}>Analytics</span>
          <span className="link" style={{cursor: 'pointer'}}>Download</span>
        </div>
      </div>

      {/* Table */}
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width:32 }} />
              <th style={{ width:120 }}>Product</th>
              <th>Instrument</th>
              <th style={{ width:80, textAlign:'right' }}>Qty.</th>
              <th style={{ width:100, textAlign:'right' }}>Avg.</th>
              <th style={{ width:100, textAlign:'right' }}>LTP</th>
              <th style={{ width:110, textAlign:'right' }}>P&L</th>
              <th style={{ width:90, textAlign:'right' }}>Chg.</th>
              <th style={{ width:28 }} />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const priceChange = priceChanges[r.instrument];
              const isRecentChange = priceChange && (Date.now() - priceChange.timestamp < 1000);
              
              return (
                <tr key={i}>
                  <td><input type="checkbox" style={{ width:16, height:16 }} /></td>
                  <td>
                    <span className={`pill ${r.product.toLowerCase()}`}>{r.product}</span>
                    {r.holding && <span className="pill holding">HOLDING</span>}
                  </td>
                  <td>
                    <span>{r.instrument}</span>
                    <span className="muted">{r.exchange}</span>
                  </td>
                  <td className={`right ${r.qty < 0 ? 'loss':''}`}>{r.qty}</td>
                  <td className="right">{r.avg}</td>
                  <td className={`right gray ${
                    isRecentChange && priceChange.direction === 'up' ? 'price-up' :
                    isRecentChange && priceChange.direction === 'down' ? 'price-down' : ''
                  }`}>
                    {r.ltp}
                    {isRecentChange && priceChange.direction === 'up' && <span className="price-arrow">▲</span>}
                    {isRecentChange && priceChange.direction === 'down' && <span className="price-arrow">▼</span>}
                  </td>
                  <td className={`right ${String(r.pnl).startsWith('-')? 'loss':'profit'}`}>{r.pnl}</td>
                  <td className={`right ${String(r.chg).startsWith('-')? 'loss':'profit'}`}>{r.chg}</td>
                  <td>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:'#9aa1a8', boxShadow:'0 6px 0 #9aa1a8, 0 -6px 0 #9aa1a8', display:'inline-block' }} />
                  </td>
                </tr>
              );
            })}
            <tr>
              <td colSpan={6} className="right" style={{ color:'#6f7680' }}>Total</td>
              <td className={`right ${String(positionsData.totals.totalPnl).startsWith('-') ? 'loss' : 'profit'}`}>{positionsData.totals.totalPnl}</td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Day's history (collapsed) */}
      <div style={{ display:'flex', alignItems:'center', gap:8, margin:'26px 0 8px 0', color:'#3a3f45' }}>
        <div style={{ fontSize:18 }}>Day's history ({positionsData.dayHistory.count})</div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M8 10l4 4 4-4" stroke="#9aa1a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>

      {/* Breakdown */}
      <div style={{ marginTop: 22, fontSize: 18, color: '#3a3f45' }}>Breakdown</div>
      <div style={{ padding: '8px 0 24px' }}>
        <div style={{ maxWidth: 820 }}>
          {breakdown.map((label, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', margin:'18px 0 18px 36px' }}>
              <div style={{ height:10, width:`${80 - i*7}%`, background:'#ff6b3d', borderRadius:2 }} />
              <div style={{ marginLeft:10, fontSize:12, color:'#6f7680' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
