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
      padding: "0 16px", borderBottom: "1px solid #eef2f4", background: "#fff"
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: 10, background: "#0ca5ff" }} />
      <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
    </div>
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
        <div>⚙️ Support</div>
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
    <div style={{ background: "#f7f8fb", minHeight: "100vh" }}>
      <MobileHeader title="P&L" onMenu={() => setMenuOpen(true)} />
      <MobileMenu
        open={menuOpen}
        pageTitle="P&L"
        onClose={() => setMenuOpen(false)}
        onNav={(label) => { setMenuOpen(false); onNavigate?.(label); }}
      />

      {/* Date range */}
      <div style={{ padding: 12 }}>
        <div style={{ background: "#f1f3f6", borderRadius: 24, padding: 8 }}>
          <button
            onClick={() => setShowPicker((v) => !v)}
            style={{
              width: "100%", height: 40, border: "1px solid #e3e7ec", borderRadius: 8, background: "#fff",
              display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", fontSize: 14
            }}
          >
            {from.toISOString().slice(0, 10)} — {to.toISOString().slice(0, 10)} <span style={{ color: "#9aa1a8" }}>▾</span>
          </button>
        </div>
      </div>

      {/* Filter pills */}
      <div style={{ padding: "0 12px", display: "flex", gap: 10 }}>
        <button style={{ flex: 1, height: 36, borderRadius: 22, border: "1px solid #cfe0ff", background: "#fff", color: "#2f6bd7" }}>Equity</button>
        <button style={{ flex: 1, height: 36, borderRadius: 22, border: "1px solid #cfe0ff", background: "#fff", color: "#2f6bd7" }}>Combined</button>
      </div>

      {/* Picker */}
      {showPicker && (
        <div style={{ position: "relative", padding: 12 }}>
          <div
            style={{
              position: "absolute", left: 12, right: 12, background: "#fff", border: `1px solid ${border}`,
              borderRadius: 6, boxShadow: "0 18px 42px rgba(0,0,0,.10)", zIndex: 20
            }}
          >
            <div style={{ display: "flex" }}>
              <Calendar title="From" monthDate={leftMonth} selected={from} onPick={(d) => setFrom(startOfDay(d))} onNav={(n) => setLeftMonth(addMonths(leftMonth, n))} />
              <div style={{ width: 1, background: border }} />
              <Calendar title="To" monthDate={rightMonth} selected={to} onPick={(d) => setTo(startOfDay(d))} onNav={(n) => setRightMonth(addMonths(rightMonth, n))} />
            </div>
          </div>
        </div>
      )}

      {/* Summary card */}
      <div style={{ margin: 12, background: "#fff", borderRadius: 8, boxShadow: "0 1px 0 #e9edf1" }}>
        <div style={{ display: "flex", padding: "14px 14px 6px", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#6f7680", fontSize: 14 }}>Realised P&L</div>
            <div style={{ color: "#0aa86f", fontSize: 22, fontWeight: 600, marginTop: 4 }}>+{asMoney(data.realisedTotal)}</div>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ color: "#6f7680", fontSize: 14 }}>Unrealised P&L</div>
            <div style={{ color: "#0aa86f", fontSize: 22, fontWeight: 600, marginTop: 4 }}>+{asMoney(consoleApiData?.unrealisedPL || 0)}</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #f1f3f5", marginTop: 8 }} />
        {[
          { l: "Charges & taxes", v: asMoney(data.charges) },
          { l: "Other credits & debits", v: asMoney(data.other) },
          { l: "Net realised P&L", v: `+${asMoney(data.realisedTotal + data.other - data.charges)}`, green: true }
        ].map((row, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: i < 2 ? "#f7f8fb" : "#fff", borderTop: i === 0 ? "none" : "1px solid #f1f3f5" }}>
            <div style={{ color: "#6f7680", fontSize: 14 }}>{row.l}</div>
            <div style={{ color: row.green ? "#0aa86f" : "#2f3337", fontSize: 14 }}>{row.v}</div>
          </div>
        ))}
        <div style={{ padding: "10px 14px" }}>
          <button style={{ padding: 0, border: "none", background: "transparent", color: "#2f6bd7", fontSize: 15, cursor: "pointer" }}>View charges breakdown →</button>
        </div>
      </div>

      {/* Last updated + actions */}
      <div style={{ padding: "0 12px 12px", color: "#6f7680", fontSize: 13 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>⏱️  Last updated: {new Date().toISOString().slice(0, 10)}</div>
          <div style={{ display: "flex", gap: 16 }}>
            <span style={{ color: "#2563eb" }}>Download</span>
            <span style={{ color: "#2563eb" }}>Sort</span>
          </div>
        </div>
      </div>

      {/* rows list */}
      <div style={{ borderTop: "1px solid #eef2f4", background: "#fff" }}>
        {data.rows.map((r, i) => (
          <div key={i} style={{ padding: "14px 16px", borderTop: i ? "1px solid #f1f3f5" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{r.symbol}</div>
              <div style={{ color: "#0aa86f", fontWeight: 600 }}>+{asMoney(r.realised)}</div>
            </div>
            <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 6, columnGap: 10, fontSize: 14, color: "#6f7680" }}>
              <div>Buy avg.</div><div style={{ color: "#111" }}>{fmt(r.buyAvg)}</div>
              <div>Sell avg.</div><div style={{ color: "#111" }}>{fmt(r.sellAvg)}</div>
              <div>Buy value</div><div style={{ color: "#111" }}>{fmt(r.buyVal)}</div>
              <div>Sell value</div><div style={{ color: "#111" }}>{fmt(r.sellVal)}</div>
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

/* -------- Mobile Account -------- */
const MobileAccount = ({ onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ background: "#f7f8fb", minHeight: "100vh" }}>
      <MobileHeader title="My account" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="My account" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: 12 }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 0 #e9edf1", padding: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: "#eef1f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#6f7680", fontWeight: 600 }}>
              MS
            </div>
            <div>
              <div style={{ fontWeight: 600 }}>Mahammad Sayad</div>
              <div style={{ color: "#6f7680" }}>FJP018</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: "0 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={{ color: "#6f7680" }}>CKYC no.</div>
            <div>30023879566432</div>
          </div>
          <div>
            <div style={{ color: "#6f7680" }}>Support code</div>
            <div>•••• <span style={{ color: "#2f6bd7" }}>View</span></div>
          </div>
        </div>
      </div>

      <div style={{ padding: "12px", color: "#2f3337", fontWeight: 600 }}>Personal</div>
      <div style={{ padding: "0 12px 24px" }}>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#6f7680" }}>E-mail <span style={{ color: "#2f6bd7" }}>✎</span></div>
          <div style={{ textDecoration: "underline" }}>SAHADSAAD186@GMAIL.COM</div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ color: "#6f7680" }}>Mobile <span style={{ color: "#2f6bd7" }}>✎</span></div>
          <div>*6950</div>
        </div>
        <div>
          <div style={{ color: "#6f7680" }}>PAN</div>
          <div>*182M</div>
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
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <MobileHeader title="Rewards & referrals" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="Rewards & referrals" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: "12px 16px" }}>
        {/* Wallet */}
        <div style={{ color: "#6f7680" }}>Your wallet  <span style={{ border: "1px solid #d9dee3", borderRadius: 12, padding: "0 6px", fontSize: 12, marginLeft: 6 }}>i</span></div>
        <div style={{ fontSize: 32, margin: "8px 0 6px" }}>0</div>
        <div style={{ color: "#2563eb", marginBottom: 12 }}>▢ View statement</div>

        {/* Points */}
        <div style={{ color: "#6f7680" }}>Your points</div>
        <div style={{ fontSize: 28, margin: "6px 0 6px" }}>—</div>
        <div style={{ color: "#2563eb" }}>▢ View statement</div>

        {/* Copy + social */}
        <div style={{ marginTop: 22, color: "#2f3337", fontWeight: 600 }}>
          Refer a friend and earn 300 reward points when they open an account. <span style={{ color: "#2563eb", fontWeight: 400 }}>Read more</span>
        </div>

        <div style={{ marginTop: 14, color: "#6f7680" }}>Your referral link</div>
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <div style={{ width: 30, height: 30, background: "#3b5998", borderRadius: 4 }} />
          <div style={{ width: 30, height: 30, background: "#1da1f2", borderRadius: 4 }} />
          <div style={{ width: 30, height: 30, background: "#0077b5", borderRadius: 4 }} />
          <div style={{ width: 30, height: 30, background: "#25d366", borderRadius: 4 }} />
        </div>

        <div style={{ display: "flex", marginTop: 8 }}>
          <input value={link} readOnly style={{ flex: 1, height: 44, border: "1px solid #e3e7ec", borderRight: "none", borderTopLeftRadius: 6, borderBottomLeftRadius: 6, padding: "0 10px", fontSize: 15 }} />
          <button
            onClick={() => navigator.clipboard?.writeText(link)}
            style={{ height: 44, border: "none", borderTopRightRadius: 6, borderBottomRightRadius: 6, background: "#1259ff", color: "#fff", padding: "0 16px", fontWeight: 600 }}
          >
            Copy
          </button>
        </div>

        {/* Refer a friend form */}
        <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22 }}>Refer a friend</div>
          <div style={{ color: "#2563eb" }}>👤 View referrals</div>
        </div>

        <div style={{ marginTop: 12 }}>
          <input placeholder="Name" style={{ width: "100%", height: 46, border: "1px solid #e3e7ec", borderRadius: 6, padding: "0 12px", fontSize: 15, marginBottom: 12 }} />
          <input placeholder="Email (optional)" style={{ width: "100%", height: 46, border: "1px solid #e3e7ec", borderRadius: 6, padding: "0 12px", fontSize: 15, marginBottom: 12 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value="+91" readOnly style={{ width: 74, height: 46, border: "1px solid #e3e7ec", borderRadius: 6, padding: "0 10px", fontSize: 15 }} />
            <input placeholder="Mobile" style={{ flex: 1, height: 46, border: "1px solid #e3e7ec", borderRadius: 6, padding: "0 12px", fontSize: 15 }} />
          </div>
          <button style={{ width: "100%", height: 48, border: "none", borderRadius: 6, background: "#1259ff", color: "#fff", fontWeight: 600, marginTop: 16 }}>
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
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <MobileHeader title="Gift" onMenu={() => setMenuOpen(true)} />
      <MobileMenu open={menuOpen} pageTitle="Gift" onClose={() => setMenuOpen(false)} onNav={(l)=>{ setMenuOpen(false); onNavigate?.(l); }} />

      <div style={{ padding: "12px 16px" }}>
        {/* Illustration placeholder */}
        <div style={{ marginTop: 28, display: "flex", justifyContent: "center" }}>
          <div style={{ width: 180, height: 140, background: "#1d4ed8", borderRadius: 12 }} />
        </div>
        <div style={{ textAlign: "center", color: "#6f7680", marginTop: 18 }}>
          You do not hold any stocks approved for gifting.
        </div>

        {/* History */}
        <div style={{ marginTop: 28, fontSize: 20 }}>⏱️  History</div>
        <div style={{ color: "#6f7680", marginTop: 8 }}>ⓘ  No gifts sent.</div>
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
