import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

// --- Style constants ---
const root={width:"100%",height:"auto",minHeight:"600px",maxHeight:"800px",background:"#fff",display:"flex",flexDirection:"column",fontFamily:"Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",color:"#2f3337"};
const topTabs={display:"flex",alignItems:"center",gap:18,padding:"8px 12px 0 12px",borderBottom:"1px solid #eceff2"};
const tab={padding:"10px 6px",color:"#6f7680",fontSize:14};
const tabActive={...tab,color:"#ff6a3d",borderBottom:"2px solid #ff6a3d",fontWeight:600};
const toolbar={display:"flex",alignItems:"center",gap:14,padding:"8px 12px",borderBottom:"1px solid #f0f2f4"};
const iconDot={width:14,height:14,borderRadius:3,background:"#e8edf7",border:"1px solid #d6deef"};
const railAndChart={flex:1,display:"grid",gridTemplateColumns:"260px 1fr",minHeight:"500px",maxHeight:"650px"};
const rail={borderRight:"1px solid #eef1f4",padding:"12px",display:"flex",flexDirection:"column",gap:10};
const searchBox={display:"flex",alignItems:"center",gap:8,border:"1px solid #e8eaed",borderRadius:4,padding:"6px 8px",color:"#6f7680",fontSize:14};
const railItem={padding:"8px 0",borderBottom:"1px solid #f3f5f7",fontSize:13,display:"flex",justifyContent:"space-between",alignItems:"center"};
const compare={color:"#6f7680",fontSize:12,marginTop:6};
const chartWrap={position:"relative",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",padding:"20px"};
const bottomBar={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 10px",borderTop:"1px solid #eceff2"};
const chip=(active)=>({padding:"4px 8px",border:`1px solid ${active?"#387ef5":"#e0e3e7"}`,borderRadius:4,background:active?"#387ef5":"#fff",color:active?"#fff":"#6b7280",fontSize:12,cursor:"pointer",marginLeft:6});
const changeBadge={display:"inline-flex",alignItems:"center",gap:6,fontSize:12,color:"#00c896",opacity:0.95};
const tfList=["1D","5D","1M","3M","6M","YTD","1Y","5Y","All"];
// --- replace your current StockChart with this version ---

const StockChart = ({ symbol: initialSymbol }) => {
  const { symbol: urlSymbol } = useParams();
  const navigate = useNavigate();

  const [currentSymbol, setCurrentSymbol] = useState(urlSymbol || initialSymbol || "HDFCBANK");
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("1D");
  const [chartURL, setChartURL] = useState(null);

  useEffect(() => { fetchChartData(); }, [currentSymbol, timeframe]); // eslint-disable-line
  useEffect(() => { if (urlSymbol && urlSymbol !== currentSymbol) setCurrentSymbol(urlSymbol); }, [urlSymbol, currentSymbol]);

  const intervalMap = useMemo(() => ({ "1D":"5m","5D":"15m","1M":"1d","3M":"1d","6M":"1d","YTD":"1d","1Y":"1d","5Y":"1wk","All":"1mo" }),[]);
  const rangeMap   = useMemo(() => ({ "1D":"1d","5D":"5d","1M":"1mo","3M":"3mo","6M":"6mo","YTD":"ytd","1Y":"1y","5Y":"5y","All":"max" }),[]);

  async function fetchChartData() {
    try {
      setLoading(true);
      setChartURL(null);
      const interval = intervalMap[timeframe] || "1d";
      const range = rangeMap[timeframe] || "1mo";
      const attempts = [
        `https://query1.finance.yahoo.com/v8/finance/chart/${currentSymbol}.NS?interval=${interval}&range=${range}`,
        `https://query1.finance.yahoo.com/v8/finance/chart/${currentSymbol}?interval=${interval}&range=${range}`,
        `https://query2.finance.yahoo.com/v8/finance/chart/${currentSymbol}.NS?interval=${interval}&range=${range}`,
        `https://query1.finance.yahoo.com/v8/finance/chart/${currentSymbol}.BO?interval=${interval}&range=${range}`,
      ];
      let parsed = null;
      for (const url of attempts) {
        try {
          const r = await fetch(url, { headers: { "User-Agent":"Mozilla/5.0" } });
          if (!r.ok) continue;
          const j = await r.json();
          if (j?.chart?.result?.[0]?.timestamp?.length) { parsed = j.chart.result[0]; break; }
        } catch {}
      }
      if (!parsed) { setChartData(generateMock(currentSymbol, timeframe)); setChartURL(drawChartURL()); return; }
      const ts = parsed.timestamp || [];
      const q = parsed.indicators?.quote?.[0] || {};
      const pts = ts.map((t,i)=>({
        time:new Date(t*1000),
        open:q.open?.[i] ?? q.close?.[i] ?? 0,
        high:q.high?.[i] ?? q.close?.[i] ?? 0,
        low:q.low?.[i] ?? q.close?.[i] ?? 0,
        close:q.close?.[i] ?? 0,
        volume:q.volume?.[i] ?? 0
      })).filter(p=>p.close>0);
      if (!pts.length) { setChartData(generateMock(currentSymbol, timeframe)); setChartURL(drawChartURL()); return; }
      const last = pts[pts.length-1]?.close ?? 0;
      const prev = parsed.meta?.previousClose ?? pts[0]?.close ?? last;
      const change = last - prev;
      setChartData({ symbol: parsed.meta?.symbol || currentSymbol, currentPrice:last, previousClose:prev, change, changePercent: prev ? (change/prev)*100 : 0, points: pts });
      setChartURL(drawChartURL());
    } finally { setLoading(false); }
  }

  function generateMock(sym, tf){
    const base = {HDFCBANK:945,INFY:1486,TCS:3046}[sym] || 1000;
    const n = tf==="1D"?78:tf==="5D"?120:tf==="1M"?30:tf==="3M"?60:90;
    const pts=[]; let price=base;
    for(let i=0;i<n;i++){
      const step = (tf==="1D"||tf==="5D")?5*60*1000:24*60*60*1000;
      const t = new Date(Date.now()-(n-i)*step);
      const drift = (Math.random()-0.5)*(base>1000?12:6);
      price = Math.max(price+drift, base*0.85);
      const range = base*0.018;
      const h=price+Math.random()*range, l=price-Math.random()*range;
      const o=price+(Math.random()-0.5)*(range*0.4), c=l+Math.random()*(h-l);
      pts.push({time:t,open:+o.toFixed(2),high:+h.toFixed(2),low:+l.toFixed(2),close:+c.toFixed(2),volume:Math.floor(Math.random()*1e6)});
      price=c;
    }
    const change = price-base;
    return { symbol:sym, currentPrice:price, previousClose:base, change, changePercent:(change/base)*100, points:pts };
  }

  // ⬇️ Only the candle fill logic is changed (greens are filled too)
  function drawChartURL(width=900, height=500){
    if(!chartData?.points?.length) return null;
    const canvas=document.createElement("canvas"), dpr=2;
    canvas.width=width*dpr; canvas.height=height*dpr;
    canvas.style.width=`${width}px`; canvas.style.height=`${height}px`;
    const ctx=canvas.getContext("2d"); ctx.scale(dpr,dpr);

    const paddingL=54, paddingR=76, paddingT=26, paddingB=42;
    ctx.fillStyle="#fff"; ctx.fillRect(0,0,width,height);

    const pts=chartData.points;
    const minP=Math.min(...pts.map(p=>p.low));
    const maxP=Math.max(...pts.map(p=>p.high));
    const range=Math.max(1,maxP-minP);

    ctx.strokeStyle="#eceff2"; ctx.lineWidth=1; ctx.setLineDash([3,3]);
    for(let i=0;i<=8;i++){
      const y=paddingT + (i*(height-paddingT-paddingB))/8;
      ctx.beginPath(); ctx.moveTo(paddingL,y); ctx.lineTo(width-paddingR,y); ctx.stroke();
      ctx.fillStyle="#68707b"; ctx.font="11px Arial";
      const price=maxP-(i*range)/8; ctx.fillText(`₹${price.toFixed(2)}`, width-paddingR+8, y+3);
    }
    ctx.setLineDash([]);

    const plotW=width-paddingL-paddingR, plotH=height-paddingT-paddingB;
    const cw=Math.max(2, Math.min(10, (plotW/pts.length)*0.7));

    pts.forEach((p,i)=>{
      const x=paddingL + (i*plotW)/Math.max(1,pts.length-1);
      const yO=paddingT + (1-(p.open-minP)/range)*plotH;
      const yC=paddingT + (1-(p.close-minP)/range)*plotH;
      const yH=paddingT + (1-(p.high-minP)/range)*plotH;
      const yL=paddingT + (1-(p.low-minP)/range)*plotH;
      const up=p.close>=p.open;
      const col=up?"#00c896":"#e53e3e";

      // wick
      ctx.strokeStyle=col; ctx.lineWidth=1.25;
      ctx.beginPath(); ctx.moveTo(x,yH); ctx.lineTo(x,yL); ctx.stroke();

      // body (now solid fill for BOTH directions)
      const h=Math.abs(yC-yO), y=Math.min(yO,yC);
      ctx.fillStyle=col; ctx.strokeStyle=col;
      if(h<1.5){ ctx.beginPath(); ctx.moveTo(x-cw/2,yO); ctx.lineTo(x+cw/2,yO); ctx.stroke(); }
      else { ctx.fillRect(x-cw/2,y,cw,h); }
    });
    return canvas.toDataURL('image/png');
  }

  const handleSymbolClick=(sym)=>{ setCurrentSymbol(sym); navigate(`/chart/${sym}`); };

  return (
    <div style={root}>
      {/* Tabs */}
      <div style={topTabs}>
        <div style={tabActive}>Chart</div>
        <button
          type="button"
          style={{ ...tab, textDecoration: "none", cursor: "pointer", background: "none", border: "none", padding: 0 }}
          onClick={() => navigate("/optionchain")}
        >
          Option chain
        </button>
        <button 
          onClick={() => navigate('/')} 
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px 8px'
          }}
        >
          ×
        </button>
      </div>

      {/* Toolbar (texts + icons as in screenshot) */}
      <div style={toolbar}>
        {/* tiny candle icon substitute */}
        <div title="Candles" style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={iconDot} />
        </div>
        <div style={{color:"#2f3337",fontSize:13}}>4H ▾</div>
        <div style={{color:"#2f3337",fontSize:13}}>Views ▾</div>
        <div style={{color:"#2f3337",fontSize:13}}>Studies ▾</div>
        <div style={{color:"#2f3337",fontSize:13}}>Layout ▾</div>
        <div style={{color:"#2f3337",fontSize:13}}>Events ▾</div>
        {/* tool icons row */}
        <div style={{display:"flex",gap:10,marginLeft:8}}>
          <div style={iconDot} title="Settings" />
          <div style={iconDot} title="Draw" />
          <div style={iconDot} title="Add" />
          <div style={iconDot} title="Comments" />
          <div style={iconDot} title="Table" />
          <div style={iconDot} title="Lightning" />
          <div style={iconDot} title="Refresh" />
          <div style={iconDot} title="Popout" />
        </div>
        <div style={{marginLeft:"auto",color:"#2f6bd7",fontWeight:600,cursor:"pointer"}}>Trade</div>
      </div>

      {/* Left rail + chart */}
      <div style={railAndChart}>
        <aside style={rail}>
          <div style={searchBox}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
              <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Enter Symbol"
              value={currentSymbol}
              onChange={(e)=>setCurrentSymbol(e.target.value.toUpperCase())}
              onBlur={()=>handleSymbolClick(currentSymbol)}
              style={{border:"none",outline:"none",flex:1,fontSize:14}}
            />
          </div>
          <div style={railItem}>
            <div style={{fontWeight:600}}>{currentSymbol}</div>
          </div>
          <div style={compare}>+ Compare…</div>
        </aside>

        <main style={chartWrap}>
          {loading ? (
            <div style={{ color:"#6f7680", fontSize:14 }}>Loading chart…</div>
          ) : chartURL ? (
            <img src={chartURL} alt={`${currentSymbol} chart`} style={{width:"100%",height:"100%",objectFit:"contain"}} />
          ) : (
            <div style={{ color:"#6f7680", fontSize:14 }}>No chart data available.</div>
          )}
        </main>
      </div>

      {/* Bottom bar */}
      <div style={bottomBar}>
        <div style={changeBadge}>
          <span style={{width:8,height:8,background:chartData?.change>=0?"#00c896":"#e53e3e",borderRadius:2}} />
          Chg&nbsp;{chartData ? `${chartData.changePercent.toFixed(2)}%` : "--"}
        </div>
        <div>
          {tfList.map(tf=>(
            <button key={tf} style={chip(tf===timeframe)} onClick={()=>setTimeframe(tf)}>
              {tf}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockChart;
