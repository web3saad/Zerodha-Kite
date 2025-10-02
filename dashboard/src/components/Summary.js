import React, { useState, useEffect } from "react";

// Exact-like Kite dashboard clone (desktop + mobile)
// - Uses Inter 400 (no bolds) for a closer match
// - Pure React with inline CSS + a small <style> block (media queries)
// - No referral/earn card per your request

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'http://localhost:3000';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/admin/dashboard`);
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Use default data if API fails
      setDashboardData({
        equity: { marginAvailable: "1L", marginsUsed: "0", openingBalance: "1L" },
        commodity: { marginAvailable: "50k", marginsUsed: "0", openingBalance: "50k" },
        holdings: { count: 17, pnl: "2.24k", pnlPercentage: "+16.90%", currentValue: "15.46k", investment: "13.23k", totalValue: "₹15,463.77" },
        positions: { count: 8, list: [] },
        userInfo: { name: "Sayad", greeting: "Hi, Sayad" }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading dashboard...</div>
      </div>
    );
  }
  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        :root { --text: #2f3337; --muted: #6f7680; --soft: #eceff1; --brand: #ff5a1f; }
        .inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; font-weight: 400; }
        .wrap { max-width: 980px; margin: 0 auto; padding: 0 20px; }
        .hr { border: 0; border-top: 1px solid var(--soft); margin: 12px 0; }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .card { border: 1px solid var(--soft); border-radius: 6px; padding: 22px 18px; }
        .k-title { color: #3a3f45; font-size: 18px; margin: 0 0 12px; display:flex; align-items:center; gap:10px; }
        .tiny-muted { color: #828b94; font-size: 13px; }
        .muted { color: var(--muted); }
        .big { font-size: 42px; color: #3b3f44; }
        .pill-dot { width:6px; height:6px; display:inline-block; background:#2f6bd7; border-radius:50%; margin-right:6px; }
        .header { height: 56px; display:flex; align-items:center; gap:12px; border-bottom:1px solid var(--soft); }
        .head-left { display:flex; align-items:center; gap:12px; }
        .head-right { margin-left:auto; display:flex; align-items:center; gap:18px; }
        .title-bar { height:52px; display:flex; align-items:center; justify-content:flex-start; }
        .hello { font-size: 32px; color: #2f3337; margin: 18px 0 8px; }
        .split { display:grid; grid-template-columns: 260px 1px 1fr; gap: 16px; align-items:center; }
        .vr { width:1px; height:56px; background: var(--soft); justify-self:center; }
        .hold-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items:center; }
        .hold-bar { height: 36px; border-radius: 6px; overflow:hidden; display:flex; }
        .legend { display:flex; gap:22px; align-items:center; color:#6f7680; }
        .legend .dot { width:12px; height:12px; border-radius:50%; border:1px solid #cfd6dc; display:inline-block; margin-right:8px; }
        .legend .dot.filled { background:#2f6bd7; border-color:#2f6bd7; }
        .market-grid { display:grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        @media (max-width: 480px) {
          .wrap { padding: 0 16px; }
          .row { grid-template-columns: 1fr; gap: 22px; }
          .market-grid { grid-template-columns: 1fr; }
          .hello { font-size: 28px; margin-top: 14px; }
          .split { grid-template-columns: 1fr; }
          .vr { display:none; }
        }
      `}</style>

      {/* Top header (mobile like screenshot) */}
      <div className="wrap inter">
    

        <div className="hello">{dashboardData.userInfo.greeting}</div>
        <hr className="hr" />

        {/* Equity + Commodity */}
        <div className="row">
          {/* Equity */}
          <section>
            <div className="k-title">
              <ClockIcon /> <span>Equity</span>
            </div>
            <div className="card split">
              <div>
                <div className="big">{dashboardData.equity.marginAvailable}</div>
                <div className="tiny-muted">Margin available</div>
              </div>
              <div className="vr" />
              <div className="muted" style={{ fontSize: 13 }}>
                <div style={{ marginBottom: 6 }}>
                  Margins used <span style={{ color: '#2f3337' }}>{dashboardData.equity.marginsUsed}</span>
                </div>
                <div>
                  Opening balance <span style={{ color: '#2f3337' }}>{dashboardData.equity.openingBalance}</span>
                </div>
                <div style={{ marginTop: 10, color: '#2f6bd7' }}><span className="pill-dot"/>View statement</div>
              </div>
            </div>
          </section>

          {/* Commodity */}
          <section>
            <div className="k-title">
              <DropIcon /> <span>Commodity</span>
            </div>
            <div className="card split">
              <div>
                <div className="big">{dashboardData.commodity.marginAvailable}</div>
                <div className="tiny-muted">Margin available</div>
              </div>
              <div className="vr" />
              <div className="muted" style={{ fontSize: 13 }}>
                <div style={{ marginBottom: 6 }}>
                  Margins used <span style={{ color: '#2f3337' }}>{dashboardData.commodity.marginsUsed}</span>
                </div>
                <div>
                  Opening balance <span style={{ color: '#2f3337' }}>{dashboardData.commodity.openingBalance}</span>
                </div>
                <div style={{ marginTop: 10, color: '#2f6bd7' }}><span className="pill-dot"/>View statement</div>
              </div>
            </div>
          </section>
        </div>

        {/* Holdings */}
        <section style={{ marginTop: 28 }}>
          <div className="k-title"><BagIcon /> <span>Holdings ({dashboardData.holdings.count})</span></div>

          <div className="card">
            <div className="hold-grid">
              <div>
                <div style={{ fontSize: 44, color: '#2fb344' }}>{dashboardData.holdings.pnl} <span style={{ fontSize: 18, color: '#7ac796' }}>{dashboardData.holdings.pnlPercentage}</span></div>
                <div className="tiny-muted">P&L</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'center' }}>
                <div>
                  <div className="tiny-muted" style={{ marginBottom: 4 }}>Current value</div>
                  <div style={{ fontSize: 26, color:'#2f3337' }}>{dashboardData.holdings.currentValue}</div>
                </div>
                <div>
                  <div className="tiny-muted" style={{ marginBottom: 4 }}>Investment</div>
                  <div style={{ fontSize: 26, color:'#2f3337' }}>{dashboardData.holdings.investment}</div>
                </div>
              </div>
            </div>

            <div className="hold-bar" style={{ marginTop: 18 }}>
              <Block color="#5563DE" w={18} />
              <Block color="#1EAEFF" w={18} />
              <Block color="#2F8AE0" w={18} />
              <Block color="#6B35C9" w={18} />
              <Block color="#5C3CA3" w={18} />
              <Block color="#2AA7A1" w={18} />
              <Block color="#1FAA7A" w={10} />
              <Block color="#0FAF65" w={8} />
              <Block color="#F2C94C" w={6} />
              <Block color="#F2994A" w={6} />
            </div>

            <div style={{ marginTop: 14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize: 22 }}>{dashboardData.holdings.totalValue}</div>
              <div className="legend">
                <label><span className="dot filled"/> Current value</label>
                <label><span className="dot"/> Investment value</label>
                <label><span className="dot"/> P&L</label>
              </div>
            </div>
          </div>
        </section>

        {/* Market overview + Positions */}
        <div className="market-grid" style={{ marginTop: 28 }}>
          <section>
            <div className="k-title"><TrendIcon/> <span>Market overview</span></div>
            <div className="card" style={{ height: 160, padding: 0 }}>
              <svg width="100%" height="100%" viewBox="0 0 400 160">
                <polyline fill="none" stroke="#4f7cff" strokeWidth="3" points="5,120 40,80 80,95 120,50 160,135 200,80 240,60 280,120 320,100 360,70 395,90"/>
              </svg>
            </div>
          </section>

          <section>
            <div className="k-title"><DocIcon/> <span>Positions ({dashboardData.positions.count})</span></div>
            <div className="card" style={{ paddingTop: 14 }}>
              {dashboardData.positions.list.map((p, i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 3fr', alignItems:'center', gap: 12, marginBottom: 14 }}>
                  <div className="muted" style={{ fontSize: 13 }}>{p.label}</div>
                  <div style={{ height: 10, background:'#ffe8dd', borderRadius: 5, overflow:'hidden' }}>
                    <div style={{ width: p.percentage, height: '100%', background:'#ff6a2b' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <hr className="hr" style={{ marginTop: 18 }} />
      </div>
    </div>
  );
}

// --- Small elements ---
const Block = ({ color, w }) => (
  <div style={{ background: color, width: `${w}%`, height: '100%' }} />
);

function ClockIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa1a8" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/></svg>);
}
function DropIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa1a8" strokeWidth="1.8"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>);
}
function BagIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa1a8" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7a4 4 0 0 1 8 0"/></svg>);
}
function TrendIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa1a8" strokeWidth="1.8"><path d="M3 17l6-6 4 4 7-7"/><path d="M3 21h18"/></svg>);
}
function DocIcon(){
  return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9aa1a8" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h6"/></svg>);
}
