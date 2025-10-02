// PnLConsole.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Withdraw from "./withdraw";
import Account from "./account";
import Dash from "./dash";
import PortfolioOverview from "./port";

/* -------------------- helpers -------------------- */
const fmt = (n) => n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const asMoney = (n) => `₹${fmt(Math.abs(n))}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* -------------------- Month heatmap (desktop only) -------------------- */
const MonthMini = ({ label, year, monthIndex }) => {
  const y = year;
  const m = monthIndex;
  const first = new Date(y, m, 1);
  const total = daysInMonth(y, m);
  const startW = first.getDay();

  const mulberry32 = (seed) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6D2B79F5;
      let r = Math.imul(t ^ (t >>> 15), 1 | t);
      r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  };
  const rand = mulberry32(y * 100 + m);

  const LIGHT_GREEN = "#dff6e5";
  const MID_GREEN = "#b8ebc9";
  const DARK_GREEN = "#6fd49b";
  const LIGHT_RED = "#ffd7d7";
  const MID_RED = "#ffbcbc";
  const DARK_RED = "#f07b7b";
  const VERY_LIGHT = "#f5f7fa";
  const LINE = "#eef2f5";

  const matrix = Array.from({ length: 7 }, () => Array(5).fill(null));
  for (let day = 1; day <= total; day++) {
    const offset = startW + day - 1;
    const weekCol = Math.floor(offset / 7);
    const weekDay = offset % 7;
    if (weekCol < 5) matrix[weekDay][weekCol] = day;
  }

  const cellStyle = { width: 9, height: 9, borderRadius: 2, border: `1px solid ${LINE}` };
  const shadeForWorkday = () => {
    const p = rand();
    if (p < 0.9) {
      const s = rand();
      return s < 0.65 ? LIGHT_GREEN : s < 0.9 ? MID_GREEN : DARK_GREEN;
    } else {
      const s = rand();
      return s < 0.5 ? LIGHT_RED : s < 0.85 ? MID_RED : DARK_RED;
    }
  };

  const tiles = [];
  for (let row = 0; row < 7; row++) {
    for (let col = 0; col < 5; col++) {
      const d = matrix[row][col];
      const isWeekend = row === 0 || row === 6;
      const inMonth = d !== null;
      tiles.push(
        <div key={`${row}-${col}`} style={{ ...cellStyle, background: !inMonth || isWeekend ? VERY_LIGHT : shadeForWorkday() }} />
      );
    }
  }

  return (
    <div className="month-mini">
      <div style={{ marginTop: 6, fontSize: 11, color: "#9aa1a8", letterSpacing: 0.2, textAlign: "center", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, marginTop: 4 }}>{tiles}</div>
    </div>
  );
};

/* -------------------- date picker calendar -------------------- */
const dpBlue = "#1259ff";
const muted = "#6f7680";
const border = "#e7ebee";

const NavBtn = ({ children, onClick }) => (
  <button onClick={onClick} style={{ border: `1px solid ${border}`, background: "#fff", padding: "2px 6px", borderRadius: 4, cursor: "pointer", fontWeight: 400 }}>
    {children}
  </button>
);

const Calendar = ({ title, monthDate, selected, onPick, onNav }) => {
  const y = monthDate.getFullYear();
  const m = monthDate.getMonth();
  const first = new Date(y, m, 1);
  const startW = first.getDay();
  const total = daysInMonth(y, m);

  const cells = [];
  for (let i = 0; i < startW; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(new Date(y, m, d));

  return (
    <div style={{ width: 330 }}>
      <div style={{ background: dpBlue, color: "#fff", height: 26, borderTopLeftRadius: 4, borderTopRightRadius: 4, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", padding: "0 12px" }}>
        {title}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", borderBottom: `1px solid ${border}` }}>
        <div style={{ display: "flex", gap: 6 }}>
          <NavBtn onClick={() => onNav(-12)}>«</NavBtn>
          <NavBtn onClick={() => onNav(-1)}>‹</NavBtn>
        </div>
        <div style={{ fontSize: 14, color: "#2f3337", fontWeight: 500 }}>{monthDate.toLocaleString("en-US", { month: "short" })} {y}</div>
        <div style={{ display: "flex", gap: 6 }}>
          <NavBtn onClick={() => onNav(1)}>›</NavBtn>
          <NavBtn onClick={() => onNav(12)}>»</NavBtn>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "6px 10px 0", fontSize: 11, color: muted, fontWeight: 400 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => <div key={w} style={{ textAlign: "center" }}>{w}</div>)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "6px 10px 12px" }}>
        {cells.map((d, i) => {
          const active = d && selected && sameDay(d, selected);
          return (
            <button
              key={i}
              disabled={!d}
              onClick={() => d && onPick(d)}
              style={{
                height: 30, borderRadius: 4, border: `1px solid ${border}`,
                background: d ? (active ? dpBlue : "#fff") : "#f8fafc",
                color: active ? "#fff" : "#2f3337", cursor: d ? "pointer" : "default", fontSize: 14, fontWeight: 400
              }}
            >
              {d ? d.getDate() : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ========================= MOBILE COMPONENTS ========================= */
const MobileHeader = ({ title = "P&L", onMenu }) => (
  <div
    style={{
      height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 16px", borderBottom: "1px solid #eef2f4", background: "#fff",
      position: "relative"
    }}
  >
    {/* Left blue circle */}
    <div style={{ width: 24, height: 24, borderRadius: 12, background: "#1e40af" }} />
    
    {/* Centered title */}
    <div style={{ 
      position: "absolute", 
      left: "50%", 
      transform: "translateX(-50%)",
      fontSize: 18, 
      fontWeight: 500,
      color: "#374151"
    }}>
      {title}
    </div>
    
    {/* Right menu button */}
    <button onClick={onMenu} aria-label="menu" style={{ background: "none", border: 0, padding: 8, cursor: "pointer" }}>
      <div style={{ width: 18, height: 2, background: "#222", boxShadow: "0 6px 0 #222, 0 -6px 0 #222" }} />
    </button>
  </div>
);

/* Full-height mobile menu (overlay) */
const MobileMenu = ({ open, pageTitle, onClose, onNav }) => {
  if (!open) return null;

  const Item = ({ label, chevron }) => (
    <div
      onClick={() => onNav(label)}
      style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "16px 18px", borderBottom: "1px solid #f1f3f5", color: "#6f7680", cursor: "pointer"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ width: 18, color: "#b8bec5" }}>◯</span>
        <span style={{ fontSize: 16 }}>{label}</span>
      </div>
      {chevron && <span style={{ color: "#c0c6cc" }}>›</span>}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 70 }}>
      {/* header */}
      <div style={{ height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", borderBottom: "1px solid #eef2f4" }}>
        <div style={{ width: 20, height: 20, borderRadius: 10, background: "#0ca5ff" }} />
        <div style={{ fontSize: 16, fontWeight: 500 }}>{pageTitle}</div>
        <button onClick={onClose} aria-label="close" style={{ background: "none", border: 0, fontSize: 22, color: "#6f7680" }}>×</button>
      </div>

      <Item label="Dashboard" chevron />
      <Item label="Portfolio" chevron />
      <Item label="Reports" chevron />
      <Item label="Funds" chevron />
      <Item label="Account" chevron />
      <Item label="Rewards & referrals" chevron />
      <Item label="Gift securities" chevron />

      <div style={{ height: 1, background: "#f1f3f5" }} />
      <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 18px", color: "#6f7680" }}>
        <div 
          onClick={() => window.open('https://support.zerodha.com/category/console/portfolio', '_blank')}
          style={{ cursor: "pointer" }}
        >
          ⚙️ Support
        </div>
        <div>↪ Logout</div>
      </div>
    </div>
  );
};

/* -------- Mobile P&L -------- */
const MobilePnL = ({
  data, consoleApiData, from, to, setShowPicker, showPicker,
  leftMonth, rightMonth, setFrom, setTo, setLeftMonth, setRightMonth, onNavigate
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <MobileHeader title="P&L" onMenu={() => setMenuOpen(true)} />
      <MobileMenu
        open={menuOpen}
        pageTitle="P&L"
        onClose={() => setMenuOpen(false)}
        onNav={(label) => { setMenuOpen(false); onNavigate?.(label); }}
      />

      {/* Date range with grey background and rounded corners */}
      <div style={{ 
        background: "#f1f3f4", 
        padding: "16px 0", 
        display: "flex", 
        justifyContent: "center",
        borderRadius: "18px",
        margin: "0 16px"
      }}>
        <button
          onClick={() => setShowPicker((v) => !v)}
          style={{
            border: "none", 
            background: "transparent",
            fontSize: 16, 
            color: "#6b7280",
            fontWeight: 400,
            cursor: "pointer"
          }}
        >
          {from.toISOString().slice(0, 10)} — {to.toISOString().slice(0, 10)}
        </button>
      </div>

      {/* Filter pills centered - both with blue borders */}
      <div style={{ 
        padding: "20px 0", 
        display: "flex", 
        justifyContent: "center", 
        gap: 16,
        background: "#fff"
      }}>
        <button style={{ 
          paddingLeft: 24, paddingRight: 24, height: 40, borderRadius: 20, 
          border: "1px solid #7c9aef", background: "transparent", color: "#7c9aef", 
          fontSize: 15, fontWeight: 400
        }}>
          Equity
        </button>
        <button style={{ 
          paddingLeft: 24, paddingRight: 24, height: 40, borderRadius: 20, 
          border: "1px solid #7c9aef", background: "transparent", color: "#7c9aef", 
          fontSize: 15, fontWeight: 400
        }}>
          Combined
        </button>
      </div>

      {/* Picker */}
      {showPicker && (
        <div style={{ position: "relative", padding: 16 }}>
          <div
            style={{
              position: "absolute", left: 16, right: 16, background: "#fff", border: `1px solid #e5e7eb`,
              borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,.15)", zIndex: 20
            }}
          >
            <div style={{ display: "flex" }}>
              <Calendar title="From" monthDate={leftMonth} selected={from} onPick={(d) => setFrom(startOfDay(d))} onNav={(n) => setLeftMonth(addMonths(leftMonth, n))} />
              <div style={{ width: 1, background: "#e5e7eb" }} />
              <Calendar title="To" monthDate={rightMonth} selected={to} onPick={(d) => setTo(startOfDay(d))} onNav={(n) => setRightMonth(addMonths(rightMonth, n))} />
            </div>
          </div>
        </div>
      )}

      {/* P&L Summary Card */}
      <div style={{ 
        margin: "0 16px 16px", 
        background: "#fff", 
        borderRadius: 12, 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", 
        overflow: "hidden" 
      }}>
        {/* Main P&L values */}
        <div style={{ padding: "20px 20px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <div style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>Realised P&L</div>
              <div style={{ color: "#10b981", fontSize: 18, fontWeight: 600, marginTop: 2 }}>+{asMoney(data.realisedTotal)}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#6b7280", fontSize: 14, fontWeight: 400 }}>Unrealised P&L</div>
              <div style={{ color: "#10b981", fontSize: 18, fontWeight: 600, marginTop: 2 }}>+{asMoney(consoleApiData?.unrealisedPL || 0)}</div>
            </div>
          </div>
        </div>

        {/* Breakdown section with grey background */}
        <div style={{ background: "#f9fafb" }}>
          <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Charges & taxes</div>
            <div style={{ color: "#374151", fontSize: 14 }}>{asMoney(data.charges)}</div>
          </div>
          <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
            <div style={{ color: "#6b7280", fontSize: 14 }}>Other credits & debits</div>
            <div style={{ color: "#374151", fontSize: 14 }}>{asMoney(data.other)}</div>
          </div>
        </div>

        {/* Net P&L */}
        <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ color: "#6b7280", fontSize: 14 }}>Net realised P&L</div>
          <div style={{ color: "#10b981", fontSize: 14, fontWeight: 600 }}>+{asMoney(data.realisedTotal + data.other - data.charges)}</div>
        </div>

        {/* View charges breakdown */}
        <div style={{ padding: "12px 20px 20px" }}>
          <button style={{ 
            padding: 0, border: "none", background: "transparent", 
            color: "#3b82f6", fontSize: 14, cursor: "pointer" 
          }}>
            View charges breakdown →
          </button>
        </div>
      </div>

      {/* Last updated + actions */}
      <div style={{ 
        padding: "0 16px 16px", 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center" 
      }}>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          color: "#9ca3af", 
          fontSize: 13 
        }}>
          <span style={{ marginRight: 6 }}>🕐</span>
          Last updated: {new Date().toISOString().slice(0, 10)}
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <button style={{ 
            background: "none", 
            border: "none", 
            color: "#3b82f6", 
            fontSize: 13, 
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}>
            <span style={{ marginRight: 4 }}>📥</span>
            Download
          </button>
          <button style={{ 
            background: "none", 
            border: "none", 
            color: "#3b82f6", 
            fontSize: 13, 
            cursor: "pointer",
            display: "flex",
            alignItems: "center"
          }}>
            <span style={{ marginRight: 4 }}>⚏</span>
            Sort
          </button>
        </div>
      </div>

      {/* Pagination info */}
      <div style={{ 
        padding: "0 16px 16px", 
        color: "#9ca3af", 
        fontSize: 13 
      }}>
        Page 1/1
      </div>

      {/* Stock rows - using original data */}
      <div style={{ background: "#fff" }}>
        {data.rows.map((r, i) => (
          <div key={i} style={{ 
            padding: "16px", 
            borderBottom: "1px solid #f3f4f6" 
          }}>
            {/* Stock name and Qty */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: 12
            }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#111827" }}>{r.symbol}</div>
              <div style={{ fontSize: 14, color: "#9ca3af" }}>Qty. <span style={{ fontWeight: 500 }}>{r.qty}</span></div>
            </div>
            
            {/* Realised P&L - all in one line */}
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              marginBottom: 16,
              gap: 8
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af" }}>Realised</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: "#10b981" }}>+{asMoney(r.realised)}</div>
              <div style={{ fontSize: 13, color: "#10b981" }}>(+{((r.realised / (r.buyVal || 1)) * 100).toFixed(2)}%)</div>
            </div>
            
            {/* Buy/Sell details - labels and values on same row */}
            <div style={{ fontSize: 14 }}>
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between",
                marginBottom: 8
              }}>
                <div style={{ color: "#9ca3af" }}>Buy avg.</div>
                <div style={{ color: "#374151", fontWeight: 500 }}>{fmt(r.buyAvg)}</div>
                <div style={{ color: "#9ca3af" }}>Buy value</div>
                <div style={{ color: "#374151", fontWeight: 500 }}>{fmt(r.buyVal)}</div>
              </div>
              
              <div style={{ 
                display: "flex", 
                justifyContent: "space-between"
              }}>
                <div style={{ color: "#9ca3af" }}>Sell avg.</div>
                <div style={{ color: "#374151", fontWeight: 500 }}>{fmt(r.sellAvg)}</div>
                <div style={{ color: "#9ca3af" }}>Sell value</div>
                <div style={{ color: "#374151", fontWeight: 500 }}>{fmt(r.sellVal)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* -------- Mobile Funds -------- */
const MobileFunds = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ background: "#f7f8fb", minHeight: "100vh" }}>
      <MobileHeader title="Funds" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="Funds" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 0 #e9edf1", padding: 12 }}>
          {[
            ["Closing balance", "₹92.82"],
            ["Unsettled credits (−)", "₹0.00"],
            ["Payin (−)", "₹0.00"],
            ["Collateral utilised (+)", "₹0.00"],
          ].map((row, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", background: i % 2 ? "#f7f8fb" : "#fff", borderRadius: 6, marginTop: i ? 8 : 0
            }}>
              <div style={{ color: "#2f3337" }}>{row[0]}</div>
              <div style={{ color: "#2f3337" }}>{row[1]}</div>
            </div>
          ))}
          <div style={{ textAlign: "center", color: "#6f7680", marginTop: 12 }}>
            Withdrawable balance <span style={{ border: "1px solid #d9dee3", borderRadius: 10, padding: "0 6px", fontSize: 12, marginLeft: 6 }}>i</span>
          </div>
          <div style={{ textAlign: "center", fontSize: 28, marginTop: 6 }}>₹92.82</div>
          <div style={{ textAlign: "center", marginTop: 6 }}><span style={{ color: "#2f6bd7" }}>View breakdown →</span></div>
        </div>
      </div>

      <div style={{ padding: "0 12px", display: "flex", gap: 22, marginTop: 8, color: "#2f3337" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="radio" name="speed" defaultChecked /> Regular (24-48 hours)
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input type="radio" name="speed" /> Instant (Max: ₹200000)
        </label>
      </div>

      <div style={{ padding: 12 }}>
        <input placeholder="Amount to withdraw" style={{ width: "100%", height: 44, border: "1px solid #e3e7ec", borderRadius: 6, padding: "0 10px", fontSize: 15 }} />
      </div>

      <div style={{ padding: 12 }}>
        <button style={{ width: "100%", height: 46, border: "none", borderRadius: 6, background: "#1259ff", color: "#fff", fontWeight: 600 }}>
          Continue
        </button>
      </div>
    </div>
  );
};

/* -------- Mobile Account Details Menu -------- */
const MobileAccountDetailsMenu = ({ open, onClose }) => {
  if (!open) return null;

  const MenuItem = ({ label, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: "16px 24px",
        borderBottom: "1px solid #f1f3f5",
        color: "#374151",
        cursor: "pointer",
        fontSize: 16
      }}
    >
      {label}
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 70 }}>
      {/* Header */}
      <div style={{ 
        height: 56, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        padding: "0 16px", 
        borderBottom: "1px solid #eef2f4",
        background: "#fff"
      }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: "#1e40af" }} />
        <div style={{ fontSize: 18, fontWeight: 500, color: "#374151" }}>My account</div>
        <button 
          onClick={onClose} 
          aria-label="close" 
          style={{ 
            background: "none", 
            border: 0, 
            fontSize: 22, 
            color: "#6f7680",
            cursor: "pointer"
          }}
        >
          ×
        </button>
      </div>

      {/* Menu Items */}
      <div style={{ paddingTop: 8 }}>
        <MenuItem label="Personal" onClick={() => {}} />
        <MenuItem label="Nominees" onClick={() => {}} />
        <MenuItem label="Bank" onClick={() => {}} />
        <MenuItem label="Demat" onClick={() => {}} />
        <MenuItem label="Segments" onClick={() => {}} />
        <MenuItem label="Margin Trading Facility (MTF)" onClick={() => {}} />
        <MenuItem label="Documents" onClick={() => {}} />
        <MenuItem label="Commodity declaration" onClick={() => {}} />
        <MenuItem label="Family" onClick={() => {}} />
        <MenuItem label="Verified P&L" onClick={() => {}} />
      </div>
    </div>
  );
};

/* -------- Mobile Account -------- */
const MobileAccount = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsMenuOpen, setDetailsMenuOpen] = useState(false);
  
  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <MobileHeader title="My account" onMenu={() => setMenuOpen(true)} />
      <MobileMenu 
        open={menuOpen} 
        pageTitle="My account" 
        onClose={() => setMenuOpen(false)} 
        onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} 
      />
      <MobileAccountDetailsMenu 
        open={detailsMenuOpen} 
        onClose={() => setDetailsMenuOpen(false)} 
      />

      {/* Profile Card */}
      <div style={{ padding: "16px", paddingBottom: 0 }}>
        <div style={{ 
          background: "#fff", 
          borderRadius: 12, 
          padding: "20px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 20
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ 
              width: 64, 
              height: 64, 
              borderRadius: 32, 
              background: "#e5e7eb", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              fontSize: 18,
              fontWeight: 600,
              color: "#6366f1"
            }}>
              MS
            </div>
            <div>
              <div style={{ 
                fontSize: 18, 
                fontWeight: 600, 
                color: "#111827",
                marginBottom: 4
              }}>
                Mahammad Sayad
              </div>
              <div style={{ 
                fontSize: 14, 
                color: "#6b7280" 
              }}>
                FJP018
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CKYC and Support Code */}
      <div style={{ padding: "0 16px", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          <div>
            <div style={{ 
              color: "#6b7280", 
              fontSize: 14, 
              marginBottom: 4 
            }}>
              CKYC no.
            </div>
            <div style={{ 
              fontSize: 16, 
              color: "#111827",
              fontWeight: 500
            }}>
              30023879566432
            </div>
          </div>
          <div>
            <div style={{ 
              color: "#6b7280", 
              fontSize: 14, 
              marginBottom: 4 
            }}>
              Support code
            </div>
            <div style={{ 
              fontSize: 16, 
              color: "#111827",
              fontWeight: 500
            }}>
              •••• <span style={{ color: "#3b82f6", cursor: "pointer" }}>View</span>
            </div>
          </div>
        </div>
      </div>

      {/* Blue Arrow Button */}
      <div style={{ padding: "0 16px", marginBottom: 24 }}>
        <button 
          onClick={() => setDetailsMenuOpen(true)}
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            background: "#3b82f6",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Personal Section */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ 
          fontSize: 18, 
          color: "#111827", 
          fontWeight: 600,
          marginBottom: 20
        }}>
          Personal
        </div>

        {/* Email */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            color: "#6b7280", 
            fontSize: 14, 
            marginBottom: 6 
          }}>
            E-mail 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#3b82f6" strokeWidth="2"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ 
            fontSize: 16, 
            color: "#111827",
            textDecoration: "underline",
            fontWeight: 500
          }}>
            SAHADSAAD186@GMAIL.COM
          </div>
        </div>

        {/* Mobile */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            color: "#6b7280", 
            fontSize: 14, 
            marginBottom: 6 
          }}>
            Mobile 
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="#3b82f6" strokeWidth="2"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
          </div>
          <div style={{ 
            fontSize: 16, 
            color: "#111827",
            fontWeight: 500
          }}>
            *6950
          </div>
        </div>

        {/* PAN */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ 
            color: "#6b7280", 
            fontSize: 14, 
            marginBottom: 6 
          }}>
            PAN
          </div>
          <div style={{ 
            fontSize: 16, 
            color: "#111827",
            fontWeight: 500
          }}>
            *182M
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------- Mobile Rewards & referrals -------- */
const MobileRewards = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [link] = useState("https://zerodha.com/?c=FJP018");

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <MobileHeader title="Rewards & referrals" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="Rewards & referrals" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: "16px" }}>
        {/* Wallet */}
        <div style={{ color: "#6b7280", fontSize: 16, marginBottom: 4 }}>
          Your wallet 
          <span style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            justifyContent: "center",
            width: 18, 
            height: 18, 
            border: "1px solid #9ca3af", 
            borderRadius: "50%", 
            fontSize: 12, 
            marginLeft: 6,
            color: "#9ca3af"
          }}>
            i
          </span>
        </div>
        <div style={{ fontSize: 40, fontWeight: 300, color: "#111827", marginBottom: 8 }}>0</div>
        <div style={{ 
          color: "#3b82f6", 
          fontSize: 15, 
          marginBottom: 20,
          display: "flex",
          alignItems: "center"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M7 8h10M7 12h10M7 16h4" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          View statement
        </div>

        {/* Points */}
        <div style={{ color: "#6b7280", fontSize: 16, marginBottom: 4 }}>Your points</div>
        <div style={{ fontSize: 32, fontWeight: 300, color: "#111827", marginBottom: 8 }}>—</div>
        <div style={{ 
          color: "#3b82f6", 
          fontSize: 15, 
          marginBottom: 24,
          display: "flex",
          alignItems: "center"
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6 }}>
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#3b82f6" strokeWidth="2"/>
            <path d="M7 8h10M7 12h10M7 16h4" stroke="#3b82f6" strokeWidth="2"/>
          </svg>
          View statement
        </div>

        {/* Refer text */}
        <div style={{ 
          fontSize: 16, 
          color: "#374151", 
          lineHeight: 1.5, 
          marginBottom: 8,
          fontWeight: 500
        }}>
          Refer a friend and earn 300 reward points when they open an account. 
          <span style={{ color: "#3b82f6", fontWeight: 400 }}> Read more</span>
        </div>

        {/* Social media and referral link */}
        <div style={{ color: "#6b7280", fontSize: 16, marginBottom: 12, marginTop: 20 }}>Your referral link</div>
        
        {/* Social icons */}
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          {/* Facebook */}
          <div style={{ 
            width: 40, 
            height: 40, 
            background: "#1877f2", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </div>
          
          {/* Twitter */}
          <div style={{ 
            width: 40, 
            height: 40, 
            background: "#1da1f2", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </div>
          
          {/* LinkedIn */}
          <div style={{ 
            width: 40, 
            height: 40, 
            background: "#0077b5", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
          
          {/* WhatsApp */}
          <div style={{ 
            width: 40, 
            height: 40, 
            background: "#25d366", 
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer"
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
            </svg>
          </div>
        </div>

        {/* URL input and copy button */}
        <div style={{ display: "flex", marginBottom: 24 }}>
          <input 
            value={link} 
            readOnly 
            style={{ 
              flex: 1, 
              height: 48, 
              border: "1px solid #d1d5db", 
              borderRight: "none", 
              borderTopLeftRadius: 8, 
              borderBottomLeftRadius: 8, 
              padding: "0 12px", 
              fontSize: 15,
              background: "#fff"
            }} 
          />
          <button
            onClick={() => navigator.clipboard?.writeText(link)}
            style={{ 
              height: 48, 
              border: "none", 
              borderTopRightRadius: 8, 
              borderBottomRightRadius: 8, 
              background: "#3b82f6", 
              color: "#fff", 
              padding: "0 20px", 
              fontWeight: 600,
              fontSize: 15
            }}
          >
            Copy
          </button>
        </div>

        {/* Refer a friend form */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          marginBottom: 20
        }}>
          <div style={{ fontSize: 20, color: "#111827", fontWeight: 500 }}>Refer a friend</div>
          <div style={{ 
            color: "#3b82f6", 
            fontSize: 15,
            display: "flex",
            alignItems: "center"
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 4 }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#3b82f6" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
            View referrals
          </div>
        </div>

        {/* Form */}
        <div>
          <input 
            placeholder="Name" 
            style={{ 
              width: "100%", 
              height: 48, 
              border: "1px solid #d1d5db", 
              borderRadius: 8, 
              padding: "0 12px", 
              fontSize: 15, 
              marginBottom: 16,
              background: "#fff"
            }} 
          />
          <input 
            placeholder="Email (optional)" 
            style={{ 
              width: "100%", 
              height: 48, 
              border: "1px solid #d1d5db", 
              borderRadius: 8, 
              padding: "0 12px", 
              fontSize: 15, 
              marginBottom: 16,
              background: "#fff"
            }} 
          />
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input 
              value="+91" 
              readOnly 
              style={{ 
                width: 70, 
                height: 48, 
                border: "1px solid #d1d5db", 
                borderRadius: 8, 
                padding: "0 8px", 
                fontSize: 15,
                background: "#f9fafb",
                textAlign: "center"
              }} 
            />
            <input 
              placeholder="Mobile" 
              style={{ 
                flex: 1, 
                height: 48, 
                border: "1px solid #d1d5db", 
                borderRadius: 8, 
                padding: "0 12px", 
                fontSize: 15,
                background: "#fff"
              }} 
            />
          </div>
          <button style={{ 
            width: "100%", 
            height: 48, 
            border: "none", 
            borderRadius: 8, 
            background: "#3b82f6", 
            color: "#fff", 
            fontWeight: 600,
            fontSize: 16
          }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/* -------- Mobile Gift securities -------- */
const MobileGift = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <MobileHeader title="Gift" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="Gift" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: "16px", paddingTop: "40px" }}>
        {/* Telescope illustration */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: 32 
        }}>
          <div style={{ 
            width: 200, 
            height: 200, 
            background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)", 
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Stars */}
            <div style={{
              position: "absolute",
              width: 4,
              height: 4,
              background: "#fbbf24",
              borderRadius: "50%",
              top: "20%",
              left: "25%"
            }} />
            <div style={{
              position: "absolute",
              width: 3,
              height: 3,
              background: "#fbbf24",
              borderRadius: "50%",
              top: "30%",
              right: "20%"
            }} />
            <div style={{
              position: "absolute",
              width: 2,
              height: 2,
              background: "#fbbf24",
              borderRadius: "50%",
              bottom: "25%",
              left: "30%"
            }} />
            
            {/* Telescope */}
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
              {/* Telescope base */}
              <ellipse cx="50" cy="85" rx="25" ry="8" fill="#fbbf24" opacity="0.3"/>
              
              {/* Telescope stand */}
              <rect x="47" y="70" width="6" height="15" fill="#fbbf24"/>
              
              {/* Telescope body */}
              <rect x="35" y="50" width="30" height="8" rx="4" fill="#fbbf24"/>
              <rect x="30" y="45" width="15" height="18" rx="2" fill="#f59e0b"/>
              
              {/* Telescope lens */}
              <circle cx="37.5" cy="54" r="6" fill="#1e40af"/>
              <circle cx="37.5" cy="54" r="4" fill="#3b82f6"/>
              
              {/* Telescope eyepiece */}
              <rect x="65" y="52" width="8" height="4" rx="2" fill="#f59e0b"/>
              
              {/* Ground/surface */}
              <ellipse cx="50" cy="88" rx="35" ry="5" fill="#60a5fa" opacity="0.2"/>
            </svg>
          </div>
        </div>

        {/* Message */}
        <div style={{ 
          textAlign: "center", 
          color: "#6b7280", 
          fontSize: 16,
          lineHeight: 1.5,
          marginBottom: 48,
          paddingX: 16
        }}>
          You do not hold any stocks approved for gifting.
        </div>

        {/* History section */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 12,
          fontSize: 20,
          fontWeight: 500,
          color: "#374151"
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
            <circle cx="12" cy="12" r="10" stroke="#6b7280" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="#6b7280" strokeWidth="2"/>
          </svg>
          History
        </div>

        {/* No gifts message */}
        <div style={{ 
          display: "flex", 
          alignItems: "center",
          color: "#9ca3af",
          fontSize: 15
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
            <circle cx="12" cy="12" r="10" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M12 16v-4" stroke="#9ca3af" strokeWidth="2"/>
            <path d="M12 8h.01" stroke="#9ca3af" strokeWidth="2"/>
          </svg>
          No gifts sent.
        </div>
      </div>
    </div>
  );
};

/* ========================= MAIN COMPONENT ========================= */
export default function PnLConsole() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const stripMonths = ["OCT", "NOV", "DEC", "JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEPT"];
  const baseYear = today.getFullYear();
  const defaultFrom = useMemo(() => startOfDay(addMonths(today, -13)), [today]);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(today);
  const [showPicker, setShowPicker] = useState(false);
  const [leftMonth, setLeftMonth] = useState(addMonths(today, -1));
  const [rightMonth, setRightMonth] = useState(today);
  const [searchParams, setSearchParams] = useSearchParams();
  const [consoleApiData, setConsoleApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get("tab");
    const savedTab = localStorage.getItem("consoleActiveTab");
    return tabParam || savedTab || "Reports";
  });

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(max-width: 768px)").matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    try { mql.addEventListener("change", handler); } catch { mql.addListener(handler); }
    return () => { try { mql.removeEventListener("change", handler); } catch { mql.removeListener(handler); } };
  }, []);

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    localStorage.setItem("consoleActiveTab", newTab);
    setSearchParams({ tab: newTab });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
      localStorage.setItem("consoleActiveTab", tabParam);
    }
  }, [searchParams, activeTab]);

  useEffect(() => {
    const fetchConsoleData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL || "https://zerodha-kite-890j.onrender.com"}/api/console`
        );
        const apiData = await response.json();
        setConsoleApiData(apiData);
      } catch {
        setConsoleApiData({
          realisedTotal: 5700000,
          charges: 483.14,
          otherCreditsDebits: -134.52,
          unrealisedPL: 0,
          portfolioData: [
            { symbol: "SBIN", qty: 10, buyAvg: 769.65, buyVal: 7696.5, sellAvg: 802.0, sellVal: 8020.0, realisedAmount: 855000 },
            { symbol: "TATAMOTORS", qty: 24, buyAvg: 978.81, buyVal: 23491.35, sellAvg: 1068.3, sellVal: 25639.2, realisedAmount: 4845000 }
          ]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchConsoleData();
    const interval = setInterval(fetchConsoleData, 5000);
    return () => clearInterval(interval);
  }, []);

  const data = useMemo(() => {
    if (!consoleApiData) return { realisedTotal: 0, charges: 0, other: 0, net: 0, rows: [] };
    const totalRealised = consoleApiData.realisedTotal || 0;
    const charges = consoleApiData.charges || 0;
    const other = consoleApiData.otherCreditsDebits || 0;
    const rows =
      consoleApiData.portfolioData?.map((item) => ({
        symbol: item.symbol,
        qty: item.qty,
        buyAvg: item.buyAvg,
        buyVal: item.buyVal,
        sellAvg: item.sellAvg,
        sellVal: item.sellVal,
        realised: item.realisedAmount || 0
      })) || [];
    return { realisedTotal: totalRealised, charges, other, net: totalRealised + other - charges, rows };
  }, [consoleApiData]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#fff", fontSize: 18, color: "#666" }}>
        Loading console data...
      </div>
    );
  }

  /* -------------------- MOBILE ROUTING -------------------- */
  if (isMobile) {
    const onNavigate = (label) => {
      // Map menu labels to tabs
      if (label === "Reports") return handleTabChange("Reports");
      if (label === "Dashboard") return handleTabChange("Dashboard");
      if (label === "Portfolio") return handleTabChange("Portfolio");
      if (label === "Funds") return handleTabChange("Funds");
      if (label === "Account") return handleTabChange("Account");
      if (label === "Rewards & referrals") return handleTabChange("Rewards");
      if (label === "Gift securities") return handleTabChange("Gift");
    };

    if (activeTab === "Funds") return <MobileFunds onNavigate={onNavigate} />;
    if (activeTab === "Account") return <MobileAccount onNavigate={onNavigate} />;
    if (activeTab === "Rewards") return <MobileRewards onNavigate={onNavigate} />;
    if (activeTab === "Gift") return <MobileGift onNavigate={onNavigate} />;

    // default P&L / Reports
    return (
      <MobilePnL
        data={data}
        consoleApiData={consoleApiData}
        from={from}
        to={to}
        setShowPicker={setShowPicker}
        showPicker={showPicker}
        leftMonth={leftMonth}
        rightMonth={rightMonth}
        setFrom={setFrom}
        setTo={setTo}
        setLeftMonth={setLeftMonth}
        setRightMonth={setRightMonth}
        onNavigate={onNavigate}
      />
    );
  }

  /* -------------------- DESKTOP VIEW (unchanged) -------------------- */
  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        color: "#2f3337",
        fontWeight: 400
      }}
    >
      {/* top bar */}
      <div style={{ borderBottom: "1px solid #f0f2f4", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1120,
            height: 56,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "160px 1fr 160px",
            alignItems: "center",
            padding: "0 12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <span style={{ color: "#2f6bd7", letterSpacing: 0.2, fontWeight: 500 }}>console</span>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 28, fontSize: 14, color: muted }}>
              {[
                { key: "Dashboard" },
                { key: "Portfolio" },
                { key: "Reports" },
                { key: "Funds" },
                { key: "Account" }
              ].map((t) => (
                <span
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  style={{
                    cursor: "pointer",
                    color: activeTab === t.key ? "#2f3337" : muted,
                    borderBottom: activeTab === t.key ? "2px solid #1259ff" : "none",
                    paddingBottom: 12,
                    fontWeight: 500
                  }}
                >
                  {t.key}
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
            <span style={{ background: "rgba(94,99,255,.12)", color: "#5E63FF", borderRadius: 999, padding: "2px 6px", fontSize: 14, fontWeight: 500 }}>
              MS
            </span>
            <span>FJP018</span>
          </div>
        </div>
      </div>

      {/* Desktop content (unchanged) */}
      {activeTab === "Funds" ? (
        <Withdraw />
      ) : activeTab === "Account" ? (
        <Account />
      ) : activeTab === "Dashboard" ? (
        <Dash />
      ) : activeTab === "Portfolio" ? (
        <PortfolioOverview />
      ) : (
        <DesktopReports
          data={data}
          consoleApiData={consoleApiData}
          stripMonths={stripMonths}
          baseYear={baseYear}
          from={from}
          to={to}
          leftMonth={leftMonth}
          rightMonth={rightMonth}
          setFrom={setFrom}
          setTo={setTo}
          setLeftMonth={setLeftMonth}
          setRightMonth={setRightMonth}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      )}
    </div>
  );
}

/* -------------------- Desktop Reports (extracted to keep main tidy) -------------------- */
function DesktopReports({
  data, consoleApiData, stripMonths, baseYear,
  from, to, leftMonth, rightMonth, setFrom, setTo, setLeftMonth, setRightMonth,
  showPicker, setShowPicker
}) {
  const muted = "#6f7680";
  const border = "#e7ebee";
  const dpBlue = "#1259ff";

  return (
    <div style={{ maxWidth: 1120, margin: "18px auto 40px", padding: "0 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M4 18V6l6 6 5-4 5 5v5H4Z" stroke="#2f3337" strokeWidth="1.6" />
        </svg>
        <div style={{ fontWeight: 500 }}>P&L</div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <select style={chip(140)}>
          <option defaultValue>Equity</option>
        </select>

        <div style={{ position: "relative" }}>
          <button style={{ ...comboBtn, width: 140 }}>
            <span style={{ color: "#6f7680", marginRight: 8 }}>P&L</span>
            <span style={{ color: "#2f3337" }}>Combined</span>
            <span style={{ marginLeft: 10, color: "#9aa1a8" }}>▾</span>
          </button>
        </div>

        <input style={chip(140)} placeholder="eg: INFY" />

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setShowPicker((v) => !v)}
            style={{ ...chip(260), justifyContent: "space-between", display: "inline-flex", alignItems: "center" }}
            title="Date range"
          >
            {from.toISOString().slice(0, 10)} ~ {to.toISOString().slice(0, 10)}
            <span style={{ marginLeft: 8, color: "#9aa1a8" }}>▾</span>
          </button>

          {showPicker && (
            <div
              style={{
                position: "absolute", top: 40, left: 0, background: "#fff",
                border: `1px solid ${border}`, borderRadius: 6, boxShadow: "0 18px 42px rgba(0,0,0,.10)", zIndex: 20
              }}
            >
              <div style={{ display: "flex" }}>
                <Calendar title="From" monthDate={leftMonth} selected={from} onPick={(d) => setFrom(startOfDay(d))} onNav={(n) => setLeftMonth(addMonths(leftMonth, n))} />
                <div style={{ width: 1, background: border }} />
                <Calendar title="To" monthDate={rightMonth} selected={to} onPick={(d) => setTo(startOfDay(d))} onNav={(n) => setRightMonth(addMonths(rightMonth, n))} />
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setShowPicker(false)} style={{ border: "none", background: dpBlue, color: "#fff", borderRadius: 6, height: 40, width: 34, cursor: "pointer", fontWeight: 500 }} title="Apply">→</button>
      </div>

      <div className="desktop-only" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginTop: 20 }}>
        {stripMonths.map((mLabel, i) => {
          const realMonthIndex = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8][i];
          const yearForThis = realMonthIndex >= 9 ? baseYear - 1 : baseYear;
          return <MonthMini key={mLabel} label={mLabel} year={yearForThis} monthIndex={realMonthIndex} />;
        })}
      </div>

      <div style={{ display: "flex", background: "#f6f8fb", borderRadius: 10, marginTop: 22, overflow: "hidden" }}>
        {[
          { title: "Realised P&L", value: `+${asMoney(data.realisedTotal)}`, color: "#0aa86f" },
          { title: "Charges & taxes", value: asMoney(data.charges) },
          { title: "Other credits & debits", value: asMoney(data.other) },
          { title: "Net realised P&L", value: `+${asMoney(data.realisedTotal + data.other - data.charges)}`, color: "#0aa86f" },
          { title: "Unrealised P&L", value: asMoney(0) }
        ].map((c) => (
          <div key={c.title} style={{ flex: 1, minWidth: 140, padding: "14px 22px", gap: 26, marginTop: 20 }}>
            <div style={{ color: muted, fontSize: 14 }}>{c.title}</div>
            <div style={{ marginTop: 6, color: c.color || "#2f3337" }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, color: muted, fontSize: 14 }}>
        <span>Showing page 1 (rows 1 – {data.rows.length} of {data.rows.length})</span>
        <span>•</span>
        <span>Last updated: {new Date().toISOString().slice(0, 10)}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <span style={{ ...chip(200), display: "inline-flex", alignItems: "center", gap: 8 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
              <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Search
          </span>
          <span style={{ color: "#2f6bd7", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 19h12v-8H6v8Zm0-10h12V5H6v4Z" stroke="#2f6bd7" strokeWidth="1.4" />
            </svg>
            Download
          </span>
        </div>
      </div>

      <div style={{ border: `1px solid ${border}`, borderRadius: 8, marginTop: 6, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14.5 }}>
          <thead>
            <tr style={{ background: "#fbfcfd", color: muted, textAlign: "left" }}>
              {["Symbol", "Qty.", "Buy avg.", "Buy value", "Sell avg.", "Sell value", "Realised P&L", "Unrealised P&L"].map((h, i) => (
                <th key={h} style={{ padding: "10px 12px", borderBottom: `1px solid ${border}`, ...(i === 0 ? { width: 150 } : {}) }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, idx) => (
              <tr key={idx} style={{ background: "#fff" }}>
                <td style={tdCell}>{r.symbol}</td>
                <td style={tdCell}>{r.qty}</td>
                <td style={tdCell}>{fmt(r.buyAvg)}</td>
                <td style={tdCell}>{fmt(r.buyVal)}</td>
                <td style={tdCell}>{fmt(r.sellAvg)}</td>
                <td style={tdCell}>{fmt(r.sellVal)}</td>
                <td style={{ ...tdCell, color: "#0aa86f" }}>
                  +{asMoney(r.realised)} <span style={{ color: "#8aa69e", marginLeft: 6, fontSize: 11 }}>+{((r.realised / (r.buyVal || 1)) * 100).toFixed(2)}%</span>
                </td>
                <td style={tdCell}>—</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: "#f8f9fa", padding: "40px 20px", marginTop: 40, borderTop: "1px solid #e5e7eb", marginLeft: "-12px", marginRight: "-12px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#6b7280" }}>🏢 ZERODHA</span>
              <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>© 2025. All rights reserved.</span>
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.4, marginBottom: 12 }}>
              NSE & BSE – SEBI Registration no.: INZ000031633 | MCX – SEBI Registration no.: INZ000038238 | CDSL – SEBI Registration no.: IN-DP-431-2019
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.5 }}>
              Disclaimer: The P&L report/Holdings/Positions data is prepared based on the trades and information available with us, at the time of report generation. Zerodha Broking Ltd., does not make any warranty, express or implied, or assume any legal/consequential liability, or responsibility for the authenticity, and completeness of the data presented in this report/data. To double check your P&L report/Holdings/Positions data, verify it with the Tradebook, Contract Notes and the Funds Statement which are available with you at all times.
            </div>
          </div>
          <div style={{ marginLeft: 40, fontSize: 12, color: "#3b82f6", cursor: "pointer" }}>Support</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- style helpers -------------------- */
const chip = (w) => ({ width: w, height: 40, border: "1px solid #e7ebee", background: "#fff", borderRadius: 6, padding: "0 10px", fontSize: 14, color: "#2f3337", fontWeight: 400 });
const comboBtn = { height: 40, border: "1px solid #e7ebee", background: "#fff", borderRadius: 6, padding: "0 10px", fontSize: 14, display: "inline-flex", alignItems: "center", fontWeight: 400 };
const tdCell = { padding: "10px 12px", borderBottom: "1px solid #f3f5f7", fontWeight: 400 };
