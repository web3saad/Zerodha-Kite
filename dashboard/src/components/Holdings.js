import React, { useState, useEffect } from "react";

export default function Holdings() {
  const [holdingsData, setHoldingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceChanges, setPriceChanges] = useState({});

  // Inter 400 everywhere
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchHoldingsData();
  }, []);

  // Real-time price fluctuation effect
  useEffect(() => {
    if (!holdingsData?.holdings) return;

    const interval = setInterval(() => {
      setHoldingsData(prevData => {
        const updatedHoldings = prevData.holdings.map(holding => {
          // Small random fluctuation between -0.5% to +1.5% (mostly positive to keep green)
          const fluctuationPercent = (Math.random() * 2 - 0.5) / 100; 
          const currentLtp = parseFloat(holding.ltp);
          const newLtp = currentLtp * (1 + fluctuationPercent);
          
          // Calculate new values based on updated LTP
          const newCurVal = holding.qty * newLtp;
          const newPnl = newCurVal - (holding.qty * holding.avgCost);
          const newNetChg = ((newLtp - holding.avgCost) / holding.avgCost) * 100;
          const dayChangeBase = holding.avgCost * 0.98; // Assume day started 2% lower than avg cost
          const newDayChg = ((newLtp - dayChangeBase) / dayChangeBase) * 100;

          // Track price direction for visual effects
          const prevLtp = parseFloat(holding.ltp);
          const direction = newLtp > prevLtp ? 'up' : newLtp < prevLtp ? 'down' : 'same';
          
          setPriceChanges(prev => ({
            ...prev,
            [holding.instrument]: {
              direction,
              timestamp: Date.now()
            }
          }));

          return {
            ...holding,
            ltp: newLtp.toFixed(2),
            curVal: newCurVal.toFixed(2),
            pnl: newPnl.toFixed(2),
            netChg: newNetChg.toFixed(2),
            dayChg: newDayChg.toFixed(2)
          };
        });

        // Update totals
        const totalCurrentValue = updatedHoldings.reduce((sum, holding) => 
          sum + parseFloat(holding.curVal), 0);
        const totalInvestment = updatedHoldings.reduce((sum, holding) => 
          sum + (holding.qty * holding.avgCost), 0);
        const totalPnl = totalCurrentValue - totalInvestment;
        const totalPnlPercent = (totalPnl / totalInvestment) * 100;

        return {
          ...prevData,
          holdings: updatedHoldings,
          totals: {
            ...prevData.totals,
            currentValue: totalCurrentValue.toFixed(2),
            totalPnl: totalPnl.toFixed(2),
            totalPnlPercent: totalPnlPercent.toFixed(2)
          }
        };
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [holdingsData?.holdings]);

  const fetchHoldingsData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/holdings`);
      const data = await response.json();
      setHoldingsData(data);
    } catch (error) {
      console.error('Error fetching holdings data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading holdings...</div>;
  }

  if (!holdingsData) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>No holdings data available</div>;
  }



  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        .inter { font-family: ${font}; font-weight: 400; color:#2f3337 }
        .wrap { max-width: 980px; margin: 0 auto; padding: 0 20px; }
        .topRow { display:flex; align-items:center; gap:12px; justify-content:space-between; margin: 6px 0 12px; }
        .title { font-size:18px; color:#3a3f45; font-weight:400; margin:0; }
        .controls { display:flex; align-items:center; gap:12px; }
        .select { border:1px solid #eceff2; background:#fff; border-radius:6px; padding:8px 10px; font-size:13px; color:#6f7680; }
        .search { display:flex; align-items:center; gap:8px; border:1px solid #e8eaed; border-radius:4px; padding:6px 10px; color:#6f7680; font-size:13px; min-width:210px; }
        .link { color:#2f6bd7; font-size:13px; text-decoration:none; cursor:pointer; }
        .metrics { display:grid; grid-template-columns: repeat(4, 1fr); gap: 22px; margin: 8px 0 8px; }
        .mlabel { color:#8a9097; font-size:12px; margin-bottom:6px; }
        .mval { font-size:22px; color:#2f3337; }
        .green { color:#2fb344; }
        .muted { color:#8a9097; font-size:14px; margin-left:6px; }
        .tableWrap { border-top: 1px solid #f0f2f4; }
        table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }
        th { text-align:left; padding:12px 12px; color:#8a9097; font-weight:400; }
        td { padding:12px 12px; border-top:1px solid #f4f5f6; vertical-align:middle; font-weight:400; }
        td.right { text-align:right; }
        .profit { color:#2fb344; }
        .loss { color:#e26a6a; }
        .bar { height:36px; border-radius:6px; overflow:hidden; display:flex; margin-top:18px; }
        .legendRow { margin-top:10px; display:flex; align-items:center; justify-content:space-between; }
        .legend { display:flex; align-items:center; gap:22px; color:#6f7680; }
        .dot { width:12px; height:12px; border-radius:50%; border:1px solid #cfd6dc; display:inline-block; margin-right:8px; }
        .dot.filled { background:#2f6bd7; border-color:#2f6bd7; }

        .ltp-cell {
          position: relative;
          transition: all 0.3s ease;
        }
        .price-indicator {
          display: inline-block;
          width: 0;
          height: 0;
          margin-left: 4px;
          border-left: 3px solid transparent;
          border-right: 3px solid transparent;
        }
        .price-indicator.up {
          border-bottom: 4px solid #2fb344;
        }
        .price-indicator.down {
          border-top: 4px solid #e26a6a;
        }
      `}</style>

      <div className="wrap inter">
        {/* Header */}
        <div className="topRow">
          <h3 className="title">Holdings ({holdingsData.count})</h3>
          <div className="controls">
            <select className="select" defaultValue="All stocks">
              <option>All stocks</option>
            </select>
            <div className="search">
              <SearchIcon /> <span>Search</span>
            </div>
            <span className="link" style={{cursor: 'pointer'}}>Family</span>
            <span className="link" style={{cursor: 'pointer'}}>Analytics</span>
            <span className="link" style={{cursor: 'pointer'}}>Download</span>
          </div>
        </div>

        {/* Metrics row (dynamic values from backend) */}
        <div className="metrics">
          <div>
            <div className="mlabel">Total investment</div>
            <div className="mval">{holdingsData.metrics.totalInvestment}</div>
          </div>
          <div>
            <div className="mlabel">Current value</div>
            <div className="mval">{holdingsData.totals?.currentValue || holdingsData.metrics.currentValue}</div>
          </div>
          <div>
            <div className="mlabel">Day&apos;s P&amp;L</div>
            <div className="mval"><span className="green">{holdingsData.metrics.daysPnl}</span> <span className="muted">(approx)</span></div>
          </div>
          <div>
            <div className="mlabel">Total P&amp;L</div>
            <div className="mval">
              <span className="green">
                {holdingsData.totals?.totalPnl || holdingsData.metrics.totalPnl} 
                <span className="muted">({holdingsData.totals?.totalPnlPercent || holdingsData.metrics.totalPnlPercentage}%)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Instrument</th>
                <th style={{ width:90 }}>Qty.</th>
                <th style={{ width:110 }}>Avg. cost</th>
                <th style={{ width:110 }}>LTP</th>
                <th style={{ width:120 }}>Cur. val</th>
                <th style={{ width:110 }}>P&L</th>
                <th style={{ width:110 }}>Net chg.</th>
                <th style={{ width:110 }}>Day chg.</th>
              </tr>
            </thead>
            <tbody>
              {holdingsData.holdings.map((holding, i) => {
                const pnlClass = String(holding.pnl).startsWith("-") ? "loss" : "profit";
                const netClass = String(holding.netChg).startsWith("-") ? "loss" : "profit";
                const dayClass = String(holding.dayChg).startsWith("-") ? "loss" : "profit";
                
                // Get price change information
                const priceChange = priceChanges[holding.instrument];
                
                return (
                  <tr key={i}>
                    <td>{holding.instrument}</td>
                    <td>{holding.qty}</td>
                    <td>{holding.avgCost}</td>
                    <td className="ltp-cell">
                      {holding.ltp}
                      {priceChange?.direction === 'up' && <span className="price-indicator up"></span>}
                      {priceChange?.direction === 'down' && <span className="price-indicator down"></span>}
                    </td>
                    <td>{holding.curVal}</td>
                    <td className={pnlClass}>{holding.pnl}</td>
                    <td className={netClass}>{holding.netChg}%</td>
                    <td className={dayClass}>{holding.dayChg}%</td>
                  </tr>
                );
              })}
              {/* Totals row (dynamic values) */}
              <tr>
                <td style={{ color:"#6f7680" }}>Total</td>
                <td></td><td></td><td></td>
                <td>{holdingsData.totals?.currentValue || holdingsData.totals?.totalCurrentValue}</td>
                <td className="profit">{holdingsData.totals?.totalPnl}</td>
                <td>{holdingsData.totals?.totalNetChg || '--'}</td>
                <td>{holdingsData.totals?.totalDayChg || '--'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer bar + legend + total rupee */}
        <div className="bar">
          <Seg c="#5563DE" w={18} />
          <Seg c="#1EAEFF" w={18} />
          <Seg c="#2F8AE0" w={18} />
          <Seg c="#6B35C9" w={18} />
          <Seg c="#5C3CA3" w={18} />
          <Seg c="#2AA7A1" w={10} />
          <Seg c="#1FAA7A" w={8} />
          <Seg c="#0FAF65" w={6} />
          <Seg c="#F2C94C" w={4} />
          <Seg c="#F2994A" w={4} />
        </div>

        <div className="legendRow">
          <div style={{ fontSize:18 }}>₹{holdingsData.metrics.currentValue}</div>
          <div className="legend">
            <label><span className="dot filled" /> Current value</label>
            <label><span className="dot" /> Investment value</label>
            <label><span className="dot" /> P&amp;L</label>
          </div>
        </div>
      </div>
    </div>
  );
}

const Seg = ({ c, w }) => <div style={{ background: c, width: `${w}%`, height: "100%" }} />;

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
      <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
