// PortfolioPerformance.jsx — pixel-faithful to the screenshot (no bold fonts)
import React from "react";

export default function PortfolioPerformance() {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const wrap = {
    fontFamily: font,
    color: "#1f2328",
    background: "#fff",
    minHeight: "100vh",
  };

  const page = {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "18px 18px 40px",
  };

  const h1 = {
    margin: 0,
    fontSize: 42,
    fontWeight: 400, // no bold
    letterSpacing: 0.2,
  };

  const row = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 18,
  };

  const leftCtrl = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: 18,
    fontWeight: 400,
  };

  const beta = {
    fontSize: 12,
    background: "#ffecd7",
    color: "#d36a12",
    borderRadius: 6,
    padding: "2px 8px",
  };

  const dot = { width: 6, height: 6, borderRadius: "50%", background: "#0ea08a", display: "inline-block" };

  const miniBtn = {
    width: 28,
    height: 28,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    border: "1px solid #e8edf2",
    background: "#fff",
    color: "#6b7280",
    cursor: "default",
  };

  const banner = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    background: "#eef3ff",
    color: "#1d4ed8",
    borderRadius: 22,
    padding: "8px 12px",
    fontSize: 14,
  };

  return (
    <div style={wrap}>
      <div style={page}>
        {/* Top bar / promo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={h1}>Welcome </div>
          <div style={banner}>
            <span style={{ opacity: 0.8 }}>Introducing</span>
            <span style={{ background: "#2d6df6", color: "#fff", padding: "6px 10px", borderRadius: 16 }}>Tax Filing for Zerodha Traders</span>
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "#2d6df6",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 0 4px #dfe8ff inset",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  background: "#fff",
                  borderRadius: 4,
                  transform: "rotate(45deg)",
                }}
              />
            </span>
          </div>
        </div>

        {/* Controls row */}
        <div style={row}>
          <div style={leftCtrl}>
            <span>Portfolio performance</span>
            <span style={beta}>BETA</span>
            <span style={{ color: "#6b7280" }}>▾</span>
            <span title="Info" style={{ color: "#6b7280" }}>
              ⓘ
            </span>
            {/* <span style={{ marginLeft: 18, color: "#1f2328" }}>➕ Compare</span> */}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#6b7280", fontSize: 16 }}>
              <span style={dot} />
              Equity
            </span>
            <span style={miniBtn}>⚙️</span>
            <span style={miniBtn}>⤢</span>
          </div>
        </div>

        {/* Chart card */}
        <div
          style={{
            marginTop: 22,
            border: "1px solid #eef2f6",
            borderRadius: 16,
            padding: "16px 14px 18px",
          }}
        >
          <ChartLike />
        </div>
      </div>

      {/* footer disclaimer */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '40px 20px', 
        marginTop: 40, 
        borderTop: '1px solid #e5e7eb' 
      }}>
        <div style={{ 
          maxWidth: 1120, 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start' 
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: 16 
            }}>
              <span style={{ 
                fontSize: 14, 
                fontWeight: 500, 
                color: '#6b7280' 
              }}>
                🏢 ZERODHA
              </span>
              <span style={{ 
                fontSize: 12, 
                color: '#9ca3af', 
                marginLeft: 8 
              }}>
                © 2025. All rights reserved.
              </span>
            </div>
            
            <div style={{ 
              fontSize: 11, 
              color: '#6b7280', 
              lineHeight: 1.4, 
              marginBottom: 12 
            }}>
              NSE & BSE – SEBI Registration no.: INZ000031633 | MCX – SEBI Registration no.: INZ000038238 | CDSL – SEBI Registration no.: IN-DP-431-2019
            </div>
            
            <div style={{ 
              fontSize: 11, 
              color: '#6b7280', 
              lineHeight: 1.5 
            }}>
              Disclaimer: The P&L report/Holdings/Positions data is prepared based on the trades and information available with us, at the time of report generation. Zerodha Broking Ltd., does not make any warranty, express or implied, or assume any legal/consequential liability, or responsibility for the authenticity, and completeness of the data presented in this report/data. To double check your P&L report/Holdings/Positions data, verify it with the Tradebook, Contract Notes and the Funds Statement which are available with you at all times.
            </div>
          </div>
          
          <div style={{ 
            marginLeft: 40, 
            fontSize: 12, 
            color: '#3b82f6', 
            cursor: 'pointer' 
          }}>
            Support
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------- Static SVG chart to match look --------- */
function ChartLike() {
  const W = 1120;
  const H = 460;
  const P = 36;

  // y grid lines (top to bottom) to mimic 0.06 steps
  const gridYs = [P + 40, P + 120, P + 200, P + 280, P + 360, P + 440];

  return (
    <div style={{ width: "100%", overflow: "hidden" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" role="img" aria-label="Portfolio performance">
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea08a" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0ea08a" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* grid */}
        <rect x="0" y="0" width={W} height={H} fill="#fff" />
        {gridYs.map((y, i) => (
          <g key={i}>
            <line x1={P} x2={W - P} y1={y} y2={y} stroke="#eef2f6" strokeWidth="1" />
          </g>
        ))}

        {/* increasing trend line + area fill */}
        <path
          d={`
            M ${P} ${P + 320}
            Q ${P + 150} ${P + 300}, ${P + 300} ${P + 250}
            Q ${P + 450} ${P + 200}, ${P + 600} ${P + 160}
            Q ${P + 750} ${P + 120}, ${P + 900} ${P + 80}
            L ${W - P} ${P + 60}
            V ${H - P}
            H ${P}
            Z
          `}
          fill="url(#fill)"
        />
        {/* increasing trend line */}
        <path
          d={`
            M ${P} ${P + 320}
            Q ${P + 150} ${P + 300}, ${P + 300} ${P + 250}
            Q ${P + 450} ${P + 200}, ${P + 600} ${P + 160}
            Q ${P + 750} ${P + 120}, ${P + 900} ${P + 80}
            L ${W - P} ${P + 60}
          `}
          stroke="#0ea08a" 
          strokeWidth="3" 
          fill="none"
        />

        {/* x-axis labels */}
        {["Dec", "2025", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((lab, i, arr) => {
          const x = P + ((W - 2 * P) * i) / (arr.length - 1);
          return (
            <text
              key={lab}
              x={x}
              y={H - 10}
              textAnchor="middle"
              fontSize="14"
              fill="#6b7280"
              style={{ fontWeight: 400 }}
            >
              {lab}
            </text>
          );
        })}

        {/* y-axis labels (left) */}
        {[
          { y: P + 40, t: "0.12" },
          { y: P + 120, t: "0.08" },
          { y: P + 200, t: "0.04" },
          { y: P + 280, t: "0.00" },
          { y: P + 360, t: "-0.04" },
          { y: P + 440, t: "-0.08" },
        ].map((g, i) => (
          <text key={i} x={P - 16} y={g.y + 4} textAnchor="end" fontSize="14" fill="#6b7280" style={{ fontWeight: 400 }}>
            {g.t}
          </text>
        ))}
      </svg>
    </div>
  );
}
