import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Withdraw from "./withdraw";
import Account from "./account";
import Dash from "./dash";
import PortfolioOverview from "./port";

/* -------------------- helpers -------------------- */
const fmt = (n) =>
  n.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
const asMoney = (n) => `₹${fmt(Math.abs(n))}`;
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/* ---------- tiny seeded RNG so colors stay stable across renders ---------- */
const mulberry32 = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

/* -------------------- heatmap month box (EXACT: 5 columns × 7 rows) -------------------- */
/**
 * MonthMini renders a 5-column (weeks) × 7-row (Sun..Sat) calendar heatmap like in Zerodha P&L.
 * - Weekend rows (Sun/Sat) are faint grey and non-colored.
 * - Only Mon..Fri get colors: 90% green (mix of shades), 10% red.
 * - Empty cells are faint grey, matching screenshot feel.
 *
 * Props:
 *  - label: "OCT", "NOV", ...
 *  - year: e.g. 2024
 *  - monthIndex: 0..11
 */
const MonthMini = ({ label, year, monthIndex }) => {
  const y = year;
  const m = monthIndex;
  const first = new Date(y, m, 1);
  const total = daysInMonth(y, m);
  const startW = first.getDay(); // 0 = Sun ... 6 = Sat

  // seeded RNG so the pattern is consistent for a specific month
  const rand = mulberry32(y * 100 + m);

  // palette tuned to match the first image (soft greens/reds)
  const LIGHT_GREEN = "#dff6e5";
  const MID_GREEN = "#b8ebc9";
  const DARK_GREEN = "#6fd49b";
  const LIGHT_RED = "#ffd7d7";
  const MID_RED = "#ffbcbc";
  const DARK_RED = "#f07b7b";
  const VERY_LIGHT = "#f5f7fa";
  const LINE = "#eef2f5";

  const matrix = Array.from({ length: 7 }, () => Array(5).fill(null)); // 7 rows × 5 columns

  // fill matrix with days -> week column & weekday row
  for (let day = 1; day <= total; day++) {
    const offset = startW + day - 1; // 0..41
    const weekCol = Math.floor(offset / 7);
    const weekDay = offset % 7; // 0=Sun..6=Sat
    if (weekCol < 5) matrix[weekDay][weekCol] = day;
  }

  const cellStyle = {
    width: 9,
    height: 9,
    borderRadius: 2,
    border: `1px solid ${LINE}`,
  };

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
        <div
          key={`${row}-${col}`}
          style={{
            ...cellStyle,
            background: !inMonth || isWeekend ? VERY_LIGHT : shadeForWorkday(),
          }}
        />
      );
    }
  }

  return (
    <div>
      <div style={{ marginTop: 6, fontSize: 11, color: "#9aa1a8", letterSpacing: 0.2, textAlign: "center", textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 2, marginTop: 4 }}>
        {tiles}
      </div>
    </div>
  );
};

/* -------------------- date picker calendar -------------------- */
const dpBlue = "#1259ff";
const muted = "#6f7680";
const border = "#e7ebee";

const NavBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      border: `1px solid ${border}`,
      background: "#fff",
      padding: "2px 6px",
      borderRadius: 4,
      cursor: "pointer",
      fontWeight: 400,
    }}
  >
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
      {/* blue bar header */}
      <div
        style={{
          background: dpBlue,
          color: "#fff",
          height: 26,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          padding: "0 12px",
        }}
      >
        {title}
      </div>

      {/* month nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <NavBtn onClick={() => onNav(-12)}>«</NavBtn>
          <NavBtn onClick={() => onNav(-1)}>‹</NavBtn>
        </div>
        <div style={{ fontSize: 14, color: "#2f3337", fontWeight: 500 }}>
          {monthDate.toLocaleString("en-US", { month: "short" })} {y}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <NavBtn onClick={() => onNav(1)}>›</NavBtn>
          <NavBtn onClick={() => onNav(12)}>»</NavBtn>
        </div>
      </div>

      {/* weekdays */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 4,
          padding: "6px 10px 0",
          fontSize: 11,
          color: muted,
          fontWeight: 400,
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
          <div key={w} style={{ textAlign: "center" }}>
            {w}
          </div>
        ))}
      </div>

      {/* days */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, padding: "6px 10px 12px" }}>
        {cells.map((d, i) => {
          const active = d && selected && sameDay(d, selected);
          return (
            <button
              key={i}
              disabled={!d}
              onClick={() => d && onPick(d)}
              style={{
                height: 30,
                borderRadius: 4,
                border: `1px solid ${border}`,
                background: d ? (active ? dpBlue : "#fff") : "#f8fafc",
                color: active ? "#fff" : "#2f3337",
                cursor: d ? "pointer" : "default",
                fontSize: 14,
                fontWeight: 400,
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

/* -------------------- main page -------------------- */
export default function PnLConsole() {
  const today = useMemo(() => startOfDay(new Date()), []);
  // Financial-year style band (Oct -> Sept) for the month strip
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

  // Initialize active tab from localStorage or URL parameter, defaulting to "Reports"
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab');
    const savedTab = localStorage.getItem('consoleActiveTab');
    return tabParam || savedTab || "Reports";
  });

  // Update URL and localStorage when tab changes
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    localStorage.setItem('consoleActiveTab', newTab);
    setSearchParams({ tab: newTab });
  };

  // Check for tab parameter in URL and set the active tab accordingly
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
      localStorage.setItem('consoleActiveTab', tabParam);
    }
  }, [searchParams, activeTab]);

  // Fetch console data from API
  useEffect(() => {
    const fetchConsoleData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/console`);
        const apiData = await response.json();
        setConsoleApiData(apiData);
      } catch (error) {
        console.error('Error fetching console data:', error);
        // Use fallback data if API fails
        setConsoleApiData({
          realisedTotal: 5700000,
          charges: 483.14,
          otherCreditsDebits: -134.52,
          unrealisedPL: 0,
          portfolioData: [
            {
              symbol: "SBIN",
              qty: 10,
              buyAvg: 769.65,
              buyVal: 7696.50,
              sellAvg: 802.00,
              sellVal: 8020.00,
              realisedPL: "+₹8,55,000.00",
              realisedAmount: 855000,
              unrealisedPL: "—"
            },
            {
              symbol: "TATAMOTORS",
              qty: 24,
              buyAvg: 978.81,
              buyVal: 23491.35,
              sellAvg: 1068.30,
              sellVal: 25639.20,
              realisedPL: "+₹48,45,000.00",
              realisedAmount: 4845000,
              unrealisedPL: "—"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchConsoleData();
    
    // Set up polling to refresh data every 5 seconds
    const interval = setInterval(fetchConsoleData, 5000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // computed pnl using API data
  const data = useMemo(() => {
    if (!consoleApiData) {
      return {
        realisedTotal: 0,
        charges: 0,
        other: 0,
        net: 0,
        rows: [],
      };
    }

    const totalRealised = consoleApiData.realisedTotal || 0;
    const charges = consoleApiData.charges || 0;
    const other = consoleApiData.otherCreditsDebits || 0;

    // Convert portfolio data to the format expected by the UI
    const rows = consoleApiData.portfolioData?.map(item => ({
      symbol: item.symbol,
      qty: item.qty,
      buyAvg: item.buyAvg,
      buyVal: item.buyVal,
      sellAvg: item.sellAvg,
      sellVal: item.sellVal,
      realised: item.realisedAmount || 0,
    })) || [];

    return {
      realisedTotal: totalRealised,
      charges,
      other,
      net: totalRealised + other - charges,
      rows,
    };
  }, [consoleApiData]);

  // Show loading state while fetching data
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#fff',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading console data...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        color: "#2f3337",
        fontWeight: 400,
      }}
    >
      {/* centered top bar: console • tabs • profile inside a centered container (fonts not bold) */}
      <div style={{ borderBottom: "1px solid #f0f2f4", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1120,
            height: 56,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "160px 1fr 160px",
            alignItems: "center",
            padding: "0 12px",
          }}
        >
          {/* left: console word */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <span style={{ color: "#2f6bd7", letterSpacing: 0.2, fontWeight: 500 }}>console</span>
          </div>

          {/* middle: tabs centered */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 28, fontSize: 14, color: muted }}>
              {[
                { key: "Dashboard" },
                { key: "Portfolio" },
                { key: "Reports" },
                { key: "Funds" },
                { key: "Account" },
              ].map((t) => (
                <span
                  key={t.key}
                  onClick={() => handleTabChange(t.key)}
                  style={{
                    cursor: "pointer",
                    color: activeTab === t.key ? "#2f3337" : muted,
                    borderBottom: activeTab === t.key ? "2px solid #1259ff" : "none",
                    paddingBottom: 12,
                    fontWeight: 500,
                  }}
                >
                  {t.key}
                </span>
              ))}
            </div>
          </div>

          {/* right: profile */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
            <span
              style={{
                background: "rgba(94,99,255,.12)",
                color: "#5E63FF",
                borderRadius: 999,
                padding: "2px 6px",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              MS
            </span>
            <span>FJP018</span>
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "Funds" ? (
        <Withdraw />
      ) : activeTab === "Account" ? (
        <Account />
      ) : activeTab === "Dashboard" ? (
        <Dash />
      ) : activeTab === "Portfolio" ? (
        <PortfolioOverview />
      ) : (
        <div style={{ maxWidth: 1120, margin: "18px auto 40px", padding: "0 12px" }}>
          {/* Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M4 18V6l6 6 5-4 5 5v5H4Z" stroke="#2f3337" strokeWidth="1.6" />
            </svg>
            <div style={{ fontWeight: 500 }}>P&L</div>
          </div>

          {/* Filters row */}
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

            {/* date range input + picker */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowPicker((v) => !v)}
                style={{
                  ...chip(260),
                  justifyContent: "space-between",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                title="Date range"
              >
                {from.toISOString().slice(0, 10)} ~ {to.toISOString().slice(0, 10)}
                <span style={{ marginLeft: 8, color: "#9aa1a8" }}>▾</span>
              </button>

              {showPicker && (
                <div
                  style={{
                    position: "absolute",
                    top: 40,
                    left: 0,
                    background: "#fff",
                    border: `1px solid ${border}`,
                    borderRadius: 6,
                    boxShadow: "0 18px 42px rgba(0,0,0,.10)",
                    zIndex: 20,
                  }}
                >
                  {/* quick ranges bar */}
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "10px 12px",
                      borderBottom: `1px solid ${border}`,
                      fontSize: 14,
                      color: muted,
                    }}
                  >
                    <span
                      style={quickLink}
                      onClick={() => {
                        const f = new Date();
                        f.setDate(f.getDate() - 7);
                        setFrom(startOfDay(f));
                        setTo(startOfDay(new Date()));
                      }}
                    >
                      last 7 days
                    </span>
                    <span
                      style={quickLink}
                      onClick={() => {
                        const f = new Date();
                        f.setDate(f.getDate() - 30);
                        setFrom(startOfDay(f));
                        setTo(startOfDay(new Date()));
                      }}
                    >
                      last 30 days
                    </span>
                    <span
                      style={quickLink}
                      onClick={() => {
                        const fy = new Date(new Date().getFullYear() - 1, 3, 1);
                        const ty = new Date(new Date().getFullYear(), 2, 31);
                        setFrom(startOfDay(fy));
                        setTo(startOfDay(ty));
                      }}
                    >
                      prev. FY
                    </span>
                    <span
                      style={quickLink}
                      onClick={() => {
                        const fy = new Date(new Date().getFullYear(), 3, 1);
                        setFrom(startOfDay(fy));
                        setTo(startOfDay(new Date()));
                      }}
                    >
                      current FY
                    </span>
                  </div>

                  {/* dual calendars */}
                  <div style={{ display: "flex" }}>
                    <Calendar
                      title="From"
                      monthDate={leftMonth}
                      selected={from}
                      onPick={(d) => setFrom(startOfDay(d))}
                      onNav={(n) => setLeftMonth(addMonths(leftMonth, n))}
                    />
                    <div style={{ width: 1, background: border }} />
                    <Calendar
                      title="To"
                      monthDate={rightMonth}
                      selected={to}
                      onPick={(d) => setTo(startOfDay(d))}
                      onNav={(n) => setRightMonth(addMonths(rightMonth, n))}
                    />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowPicker(false)}
              style={{
                border: "none",
                background: dpBlue,
                color: "#fff",
                borderRadius: 6,
                height: 40,
                width: 34,
                cursor: "pointer",
                fontWeight: 500,
              }}
              title="Apply"
            >
              →
            </button>
          </div>

          {/* months row (colored) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 16, marginTop: 20 }}>
            {stripMonths.map((mLabel, i) => {
              const realMonthIndex = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8][i];
              const yearForThis = realMonthIndex >= 9 ? baseYear - 1 : baseYear;
              return (
                <MonthMini key={mLabel} label={mLabel} year={yearForThis} monthIndex={realMonthIndex} />
              );
            })}
          </div>

          {/* summary bar */}
          <div
            style={{
              display: "flex",
            background: "#f6f8fb",
            borderRadius: 10,
            marginTop: 22,
            overflow: "hidden",
            }}
          >
            {[
              { title: "Realised P&L", value: `+${asMoney(data.realisedTotal)}`, color: "#0aa86f" },
              { title: "Charges & taxes", value: asMoney(data.charges) },
              { title: "Other credits & debits", value: asMoney(data.other) },
              { title: "Net realised P&L", value: `+${asMoney(data.realisedTotal + data.other - data.charges)}`, color: "#0aa86f" },
              { title: "Unrealised P&L", value: asMoney(consoleApiData?.unrealisedPL || 0) },
            ].map((c, i, arr) => (
              <div
                key={c.title}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: "14px 22px",
                  gap: 26, marginTop: 20,
                }}
              >
                <div style={{ color: muted, fontSize: 14 }}>{c.title}</div>
                <div style={{ marginTop: 6, color: c.color || "#2f3337" }}>{c.value}</div>
              </div>
            ))}
          </div>

          {/* table controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, color: muted, fontSize: 14 }}>
            <span>
              Showing page 1 (rows 1 – {data.rows.length} of {data.rows.length})
            </span>
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
              <span
                style={{
                  color: "#2f6bd7",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M6 19h12v-8H6v8Zm0-10h12V5H6v4Z" stroke="#2f6bd7" strokeWidth="1.4" />
                </svg>
                Download
              </span>
            </div>
          </div>

          {/* results table */}
          <div style={{ border: `1px solid ${border}`, borderRadius: 8, marginTop: 6, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14.5 }}>
              <thead>
                <tr style={{ background: "#fbfcfd", color: muted, textAlign: "left" }}>
                  {[
                    "Symbol",
                    "Qty.",
                    "Buy avg.",
                    "Buy value",
                    "Sell avg.",
                    "Sell value",
                    "Realised P&L",
                    "Unrealised P&L",
                  ].map((h, i) => (
                    <th
                      key={h}
                      style={{ padding: "10px 12px", borderBottom: `1px solid ${border}`, ...(i === 0 ? { width: 150 } : {}) }}
                    >
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
                      +{asMoney(r.realised)}{' '}
                      <span style={{ color: "#8aa69e", marginLeft: 6, fontSize: 11 }}>
                        +{(r.realised / (r.buyVal || 1) * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td style={tdCell}>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* footer disclaimer */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '40px 20px', 
            marginTop: 40, 
            borderTop: '1px solid #e5e7eb',
            marginLeft: '-12px',
            marginRight: '-12px'
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
      )}
    </div>
  );
}

/* -------------------- small style helpers -------------------- */
const chip = (w) => ({
  width: w,
  height: 40,
  border: "1px solid #e7ebee",
  background: "#fff",
  borderRadius: 6,
  padding: "0 10px",
  fontSize: 14,
  color: "#2f3337",
  fontWeight: 400,
});

const comboBtn = {
  height: 40,
  border: "1px solid #e7ebee",
  background: "#fff",
  borderRadius: 6,
  padding: "0 10px",
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  fontWeight: 400,
};

const quickLink = { cursor: "pointer", fontWeight: 400 };

const tdCell = {
  padding: "10px 12px",
  borderBottom: "1px solid #f3f5f7",
  fontWeight: 400,
};
