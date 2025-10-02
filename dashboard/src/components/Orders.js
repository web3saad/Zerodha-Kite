import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// Full single-file React implementation of Orders/GTT/Baskets/SIP/Alerts tabs
// Exact look from screenshots. Inter 400 only (no bold text anywhere).
// Drop this component into your app and render <TradingTabs />.

export default function TradingTabs() {
  const [active, setActive] = useState("Orders");
  return (
    <div style={{ background: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        .inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif; font-weight: 400; }
        .wrap { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
        .tabs { display:flex; align-items:center; gap:22px; border-bottom:1px solid #eceff2; padding:8px 12px; margin-bottom:10px; }
        .tab { font-size:13px; color:#6f7680; padding:0 0 10px; cursor:pointer; }
        .tab.active { color:#ff6a3d; border-bottom:2px solid #ff6a3d; }
        .headerRow { display:flex; align-items:center; justify-content:space-between; margin:16px 0 8px; }
        .title { margin:0; font-size:16px; color:#3a3f45; font-weight:400; }
        .search { display:flex; align-items:center; gap:8px; border:1px solid #e8eaed; border-radius:4px; padding:6px 8px; color:#6f7680; font-size:13px; min-width:210px; background:#fff; }
        .linkBlue { color:#2f6bd7; font-size:13px; text-decoration:none; cursor:pointer; }
        .tableWrap { border-top:1px solid #f0f2f4; }
        table { width:100%; border-collapse:separate; border-spacing:0; font-size:13px; }
        th { text-align:left; padding:12px 12px; color:#8a9097; font-weight:400; }
        td { padding:12px 12px; border-top:1px solid #f4f5f6; vertical-align:middle; font-weight:400; }
        td.right { text-align:right; }
        td.gray { background:#f8f9fb; }
        .pill { font-size:11px; padding:2px 8px; border-radius:4px; display:inline-block; }
        .pill.buy { color:#5b7cff; background:#eef3ff; }
        .pill.sell { color:#ff6a6a; background:#ffeef0; }
        .pill.open { color:#6f7680; background:#f2f4f7; padding:6px 10px; font-size:12px; }
        .pill.rejected { color:#e26a6a; background:#ffecee; }
        .pill.cancelled { color:#8a939d; background:#f2f4f7; }
        .pill.complete { color:#28a745; background:rgba(40,167,69,0.12); }
        .pill.active { color:#2fb344; background:#eaf8ed; font-size:12px; padding:6px 10px; }
        .pill.triggered { color:#3f76ff; background:#eaf0ff; font-size:12px; padding:6px 10px; }
        .btn-blue { background:#3f76ff; color:#fff; border-radius:6px; padding:6px 10px; font-size:13px; line-height:1; white-space:nowrap; border:none; cursor:pointer; }
        .muted { color:#8a9097; }
        .blue-link-text { color:#3f76ff; text-decoration:none; cursor:pointer; }
      `}</style>

      <div className="wrap inter">
        {/* Tabs */}
        <div className="tabs">
          {['Orders','GTT','Baskets','SIP','Alerts'].map((t)=> (
            <div key={t} className={`tab ${active===t? 'active':''}`} onClick={()=>setActive(t)}>{t}</div>
          ))}
        </div>

        {active === 'Orders' && <OrdersView />}
        {active === 'GTT' && <GTTView />}
        {active === 'Baskets' && <BasketsView />}
        {active === 'SIP' && <SIPView />}
        {active === 'Alerts' && <AlertsView />}
      </div>
    </div>
  );
}

// -------------------- ORDERS --------------------
function OrdersView(){
  const [openRows, setOpenRows] = useState([]);
  const [execRows, setExecRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrdersData = useCallback(async () => {
    setLoading(true);
    
    // Default fallback data
    const defaultOpenRows = [
      { t: "13:39:12", type: 'sell', inst: "PNB", ex: "NSE", prod: "CO", qty: "0 / 1", ltp: "49.30", price: "0.00 / 48.50 trg.", status: 'open' },
      { t: "13:39:12", type: 'buy', inst: "INFY", ex: "NSE", prod: "CO", qty: "0 / 1", ltp: "49.30", price: "49.50 / 48.50 trg.", status: 'open' },
      { t: "13:35:15", type: 'buy', inst: "USDINR 23MAY FUT", ex: "CDS", prod: "NRML", qty: "0 / 3", ltp: "82.4225", price: "81.0000", status: 'open' },
      { t: "13:34:15", type: 'buy', inst: "USDINR 23MAY FUT", ex: "CDS", prod: "MIS", qty: "0 / 1", ltp: "82.4225", price: "81.0000", status: 'open' },
      { t: "13:32:12", type: 'buy', inst: "SBIN", ex: "BSE", prod: "MIS", qty: "0 / 1", ltp: "586.50", price: "585.00 / 585.00 trg.", status: 'open' },
      { t: "13:29:52", type: 'buy', inst: "VEDL", ex: "NSE", prod: "CNC", qty: "0 / 1", ltp: "279.45", price: "0.00 / 290.00 trg.", status: 'open' },
    ];

    const defaultExecRows = [
      { t: "13:45:09", type: 'buy', inst: "11th 23MAY 18300 CE", ex: "NFO", prod: "MIS", qty: "0 / 50", avg: "0.00", status: 'rejected' },
      { t: "13:44:50", type: 'buy', inst: "11th 23MAY 18300 CE", ex: "NRML", prod: "MIS", qty: "0 / 50", avg: "0.00", status: 'rejected' },
      { t: "13:39:08", type: 'sell', inst: "PNB", ex: "NSE", prod: "CNC", qty: "0 / 1", avg: "51.20", status: 'cancelled' },
      { t: "13:37:34", type: 'buy', inst: "INFY", ex: "NSE", prod: "CNC", qty: "1 / 1", avg: "50.75", status: 'complete' },
      { t: "13:28:52", type: 'buy', inst: "VEDL", ex: "NSE", prod: "MIS", qty: "1 / 1", avg: "283.40", status: 'complete' },
    ];
    
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3000'}/api/admin/orders-page`);
      if (response.data) {
        setOpenRows(response.data.openOrders || defaultOpenRows);
        setExecRows(response.data.executedOrders || defaultExecRows);
      } else {
        setOpenRows(defaultOpenRows);
        setExecRows(defaultExecRows);
      }
    } catch (error) {
      console.error('Error fetching orders data, using defaults:', error);
      setOpenRows(defaultOpenRows);
      setExecRows(defaultExecRows);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrdersData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrdersData, 30000);
    
    // Refresh when window gets focus (user comes back from admin dashboard)
    const handleFocus = () => fetchOrdersData();
    window.addEventListener('focus', handleFocus);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchOrdersData]);

  const check = <input type="checkbox" style={{ width:16, height:16 }} />;

  const Pill = ({kind, children}) => <span className={`pill ${kind}`}>{children}</span>;
  const Type = ({t}) => <Pill kind={t==='buy'? 'buy':'sell'}>{t.toUpperCase()}</Pill>;
  const Status = ({s}) => <Pill kind={s}>{s.toUpperCase()}</Pill>;

  return (
    <div>
      {/* Yellow banner */}
    

      {/* Open orders */}
      <div className="headerRow">
        <h3 className="title">Open orders ({openRows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div className="search">
            <SearchIcon /> <span>Search</span>
          </div>
          <button 
            className="btn-blue" 
            onClick={fetchOrdersData}
            disabled={loading}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <a className="linkBlue">Download</a>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width:40 }}>{check}</th>
              <th style={{ width:120 }}>Time</th>
              <th style={{ width:100 }}>Type</th>
              <th>Instrument</th>
              <th style={{ width:120 }}>Product</th>
              <th style={{ width:110, textAlign:'right' }}>Qty.</th>
              <th style={{ width:120, textAlign:'right' }}>LTP</th>
              <th style={{ width:180 }}>Price</th>
              <th style={{ width:120 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {openRows.map((r,i)=> (
              <tr key={i}>
                <td><input type="checkbox" style={{ width:16, height:16 }} /></td>
                <td>{r.t}</td>
                <td><Type t={r.type} /></td>
                <td><span>{r.inst}</span> <span className="muted" style={{ fontSize:11, marginLeft:6 }}>{r.ex}</span></td>
                <td>{r.prod}</td>
                <td className="right">{r.qty}</td>
                <td className="right">{r.ltp}</td>
                <td>{r.price}</td>
                <td><Status s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Executed orders */}
      <div className="headerRow">
        <h3 className="title">Executed orders ({execRows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div className="search">
            <SearchIcon /> <span>Search</span>
          </div>
          <button 
            className="btn-blue" 
            onClick={fetchOrdersData}
            disabled={loading}
            style={{ fontSize: '12px', padding: '4px 8px' }}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          {/* <a className="linkBlue">Contract note</a>
          <a className="linkBlue">View history</a> */}
          <a className="linkBlue">Download</a>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width:120 }}>Time</th>
              <th style={{ width:100 }}>Type</th>
              <th>Instrument</th>
              <th style={{ width:120 }}>Product</th>
              <th style={{ width:110, textAlign:'right' }}>Qty.</th>
              <th style={{ width:120, textAlign:'right' }}>Avg. price</th>
              <th style={{ width:140 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {execRows.map((r,i)=> (
              <tr key={i}>
                <td>{r.t}</td>
                <td><Type t={r.type} /></td>
                <td><span>{r.inst}</span> <span className="muted" style={{ fontSize:11, marginLeft:6 }}>{r.ex}</span></td>
                <td>{r.prod}</td>
                <td className="right">{r.qty}</td>
                <td className="right">{r.avg}</td>
                <td><Status s={r.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------- GTT --------------------
function GTTView(){
  const rows = [
    { date:'2023-05-09', inst:'PNB', ex:'NSE', type:['OCO','SELL'], trigger:['47.80','-3.04%','52.85','7.2%'], ltp:'49.30', qty:'1 / 1', status:'ACTIVE' },
    { date:'2023-05-04', inst:'IDEA', ex:'NSE', type:['SINGLE','SELL'], trigger:['6.65','-5.67%'], ltp:'7.05', qty:'1', status:'ACTIVE' },
    { date:'2023-02-06', inst:'ONGC', ex:'BSE', type:['SINGLE','SELL'], trigger:['136.20','-18.49%'], ltp:'167.10', qty:'1', status:'ACTIVE' },
    { date:'2023-05-09', inst:'11th 23MAY 18300 CE', ex:'NFO', type:['OCO','SELL'], trigger:['50.40', '', '51.45',''], ltp:'—', qty:'50 / 50', status:'TRIGGERED' },
    { date:'2023-05-09', inst:'11th 23MAY 18300 CE', ex:'NFO', type:['OCO','BUY'], trigger:['50.00', '', '51.05',''], ltp:'—', qty:'50 / 50', status:'TRIGGERED' },
  ];

  return (
    <div>
      <div className="headerRow">
        <h3 className="title">GTT ({rows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button className="btn-blue">New GTT</button>
          <div className="search"><SearchIcon/> <span>Search</span></div>
          <a className="linkBlue">Download</a>
        </div>
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width:140 }}>Created on</th>
              <th>Instrument</th>
              <th style={{ width:180 }}>Type</th>
              <th style={{ width:200 }}>Trigger</th>
              <th style={{ width:120 }}>LTP</th>
              <th style={{ width:120 }}>Quantity</th>
              <th style={{ width:140 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td>{r.date}</td>
                <td><span>{r.inst}</span> <span className="muted" style={{ fontSize:11, marginLeft:6 }}>{r.ex}</span></td>
                <td>
                  <span className="pill" style={{ background:'#f4f5f6', color:'#6f7680', marginRight:8 }}>{r.type[0]}</span>
                  <span className={`pill ${r.type[1]==='SELL'?'sell':'buy'}`}>{r.type[1]}</span>
                </td>
                <td>
                  <div>{r.trigger[0]} <span className="muted" style={{ marginLeft:6 }}>{r.trigger[1]}</span></div>
                  {r.trigger[2] && (
                    <div>{r.trigger[2]} <span className="muted" style={{ marginLeft:6 }}>{r.trigger[3]}</span></div>
                  )}
                </td>
                <td>{r.ltp}</td>
                <td>{r.qty}</td>
                <td>
                  <span className={`pill ${r.status==='ACTIVE'? 'active':'triggered'}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------- BASKETS --------------------
function BasketsView(){
  const rows = [
    { name:'Bull call spread', items:2, created:'2021-09-24' },
    { name:'Calender spread', items:2, created:'2023-05-08' },
    { name:'Butterfly Spread', items:3, created:'2023-05-08' },
    { name:'IT stocks', items:4, created:'2023-05-08' },
    { name:'ETFs', items:4, created:'2023-05-08' },
  ];
  return (
    <div>
      <div className="headerRow">
        <h3 className="title">Baskets ({rows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button className="btn-blue">New basket</button>
          <div className="search"><SearchIcon/> <span>Search</span></div>
        </div>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width:120 }}>Items</th>
              <th style={{ width:200 }}>Created on</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td>{r.name}</td>
                <td>{r.items}</td>
                <td>{r.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------- SIP --------------------
function SIPView(){
  const rows = [
    { name:'Weekly SIPs', status:'ACTIVE', schedule:[['28th','09:30','in 1 day'],['1st','09:30','in 4 days'],['7th','09:30','in 10 days'],['14th','09:30','in 17 days'],['21st','09:30','in 24 days']], basket:'•  IT stocks', created:'2022-10-24', age:'35 months' },
    { name:'Monthly SIPs', status:'PAUSED', schedule:[['3rd','09:30','in 6 days']], basket:'•  ETFs', created:'2023-02-15', age:'31 months' },
  ];

  return (
    <div>
      <div className="headerRow">
        <h3 className="title">SIP ({rows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button className="btn-blue">New SIP</button>
          <div className="search"><SearchIcon/> <span>Search</span></div>
        </div>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width:160 }}>Status</th>
              <th style={{ width:520 }}>Monthly schedule</th>
              <th style={{ width:160 }}>Baskets</th>
              <th style={{ width:200 }}>Created on</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td>{r.name}</td>
                <td>
                  <span className={`pill ${r.status==='ACTIVE'? 'active':''}`} style={{ background: r.status==='ACTIVE'? '#eaf8ed' : '#ffece6', color: r.status==='ACTIVE'? '#2fb344' : '#ff7d5a' }}>{r.status}</span>
                </td>
                <td>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                    {r.schedule.map((s,idx)=> (
                      <div key={idx} style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span className="pill" style={{ background:'#eaf0ff', color:'#3f76ff' }}>{s[0]}</span>
                        <span className="pill" style={{ background:'#eaf0ff', color:'#3f76ff' }}>{s[1]}</span>
                        <span className="muted">{s[2]}</span>
                      </div>
                    ))}
                  </div>
                </td>
                <td>{r.basket}</td>
                <td>
                  <div>{r.created}</div>
                  <div className="muted">{r.age}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------- ALERTS --------------------
function AlertsView(){
  const rows = [
    { name:'Nifty 10% down from all time high', sub:'LastTradedPrice(INDICES:NIFTY 50) < 17300', status:'ENABLED', trig:'0', created:'2023-04-05' },
    { name:'SBIN up- buy 100 qty', sub:'LastTradedPrice(NSE:SBIN) >= 573.35', status:'DISABLED', trig:'2', created:'2023-05-09' },
    { name:'Buy at 50rs', sub:'LastTradedPrice(NFO:NIFTY23MAY18300CE) < 50', status:'ENABLED', trig:'0', created:'2023-05-09' },
  ];
  return (
    <div>
      <div className="headerRow">
        <h3 className="title">Alerts ({rows.length})</h3>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button className="btn-blue">New alert</button>
          <div className="search"><SearchIcon/> <span>Search</span></div>
        </div>
      </div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th style={{ width:40 }}><input type="checkbox" style={{ width:16, height:16 }} /></th>
              <th>Name</th>
              <th style={{ width:160 }}>Status</th>
              <th style={{ width:120 }}>Triggered</th>
              <th style={{ width:200 }}>Created on</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={i}>
                <td><input type="checkbox" style={{ width:16, height:16 }} /></td>
                <td>
                  <div><a className="blue-link-text">{r.name}</a></div>
                  <div className="muted">{r.sub}</div>
                </td>
                <td>
                  <span className="pill" style={{ background: r.status==='ENABLED'? '#eaf8ed':'#ffece6', color: r.status==='ENABLED'? '#2fb344':'#ff7d5a', padding:'6px 10px', fontSize:12 }}>{r.status}</span>
                </td>
                <td className="right">
                  <a className="blue-link-text">{r.trig}</a>
                </td>
                <td>{r.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------- Small UI helpers --------------------
function SearchIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
      <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
