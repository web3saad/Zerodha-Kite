// PnLConsole.jsx — updated: colored month boxes (90% green, 10% red; skip Sat/Sun),
// centered top navbar (console • tabs • FJP018 all within a centered container),
// and the rest of the layout unchanged.

import React, { useMemo, useState } from "react";
import Withdraw from "./withdraw";
import Account from "./account";
import Dash from "./dash";

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

/* -------------------- heatmap month box -------------------- */
/**
 * MonthMini renders a 7-column (Sun..Sat) calendar heatmap.
 * - Weekend columns (Sun/Sat) are faint grey.
 * - Only Mon..Fri get colors: 90% green (mix of light & dark), 10% red.
 * - Empty lead/trailing cells are faint grey.
 *
 * Props:
 *  - label: "OCT", "NOV", ...
 *  - year: e.g. 2024
 *  - monthIndex: 0..11 (for deterministic seeding and real month lengths)
 */
const MonthMini = ({ label, year, monthIndex }) => {
  const y = year;
  const m = monthIndex;
  const first = new Date(y, m, 1);
  const total = daysInMonth(y, m);
  const startW = first.getDay(); // 0 = Sun ... 6 = Sat

  // 6 rows x 7 cols = 42 cells
  const cells = Array.from({ length: 42 });
  // seeded RNG so the pattern is consistent for a specific month
  const rand = mulberry32(y * 100 + m);

  // color palette (subtle) — tuned to match your screenshot feel
  const LIGHT_GREEN = "#dff6e5";
  const MID_GREEN = "#b8ebc9";
  const DARK_GREEN = "#6fd49b";
  const LIGHT_RED = "#ffd7d7";
  const MID_RED = "#ffbcbc";
  const DARK_RED = "#f07b7b";
  const VERY_LIGHT = "#f5f7fa";
  const LINE = "#eef2f5";

  const cellStyleCommon = {
    width: 10,
    height: 10,
    borderRadius: 2,
    border: `1px solid ${LINE}`,
  };

  const tiles = cells.map((_, idx) => {
    const col = idx % 7; // 0 Sun ... 6 Sat
    const dayNum = idx - startW + 1;
    const inMonth = dayNum >= 1 && dayNum <= total;

    // weekend or outside month -> very light
    if (!inMonth || col === 0 || col === 6) {
      return (
        <div
          key={idx}
          style={{
            ...cellStyleCommon,
            background: VERY_LIGHT,
          }}
        />
      );
    }

    // Mon..Fri inside month: 90% green, 10% red; within green, mix shades
    const p = rand(); // 0..1
    let background;
    if (p < 0.90) {
      // green bucket — choose shade
      const shade = rand();
      background = shade < 0.65 ? LIGHT_GREEN : shade < 0.9 ? MID_GREEN : DARK_GREEN;
    } else {
      // red bucket — choose shade
      const shade = rand();
      background = shade < 0.5 ? LIGHT_RED : shade < 0.85 ? MID_RED : DARK_RED;
    }

    return <div key={idx} style={{ ...cellStyleCommon, background }} />;
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 92,
          height: 70,
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 3,
          margin: "0 auto",
        }}
      >
        {tiles}
      </div>
      <div style={{ marginTop: 6, fontSize: 11, color: "#9aa1a8", letterSpacing: 0.2 }}>{label}</div>
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
          fontSize: 12,
          fontWeight: 600,
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
        <div style={{ fontSize: 14, color: "#2f3337", fontWeight: 600 }}>
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
                fontSize: 12,
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

  // choose a base year for the strip (use current year; months JAN..SEP are current year, OCT..DEC are prev)
  const baseYear = today.getFullYear();

  const defaultFrom = useMemo(() => startOfDay(addMonths(today, -13)), [today]);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(today);
  const [showPicker, setShowPicker] = useState(false);
  const [leftMonth, setLeftMonth] = useState(addMonths(today, -1));
  const [rightMonth, setRightMonth] = useState(today);
  const [activeTab, setActiveTab] = useState("Reports");

  // computed pnl (≈ ₹57L spread over range)
  const data = useMemo(() => {
    const months =
      (to.getFullYear() - from.getFullYear()) * 12 + (to.getMonth() - from.getMonth()) + 1;
    const totalRealised = 5700000;
    const charges = Math.max(34.51 * months, 34.51);
    const other = -134.52;

    const sbinReal = totalRealised * 0.15;
    const tataReal = totalRealised - sbinReal;

    return {
      realisedTotal: totalRealised,
      charges,
      other,
      net: totalRealised + other - charges,
      rows: [
        {
          symbol: "SBIN",
          qty: 10,
          buyAvg: 769.65,
          buyVal: 7696.5,
          sellAvg: 802.0,
          sellVal: 8020.0,
          realised: sbinReal,
        },
        {
          symbol: "TATAMOTORS",
          qty: 24,
          buyAvg: 978.81,
          buyVal: 23491.35,
          sellAvg: 1068.3,
          sellVal: 25639.2,
          realised: tataReal,
        },
      ],
    };
  }, [from, to]);

  return (
    <div
      style={{
        background: "#fff",
        minHeight: "100vh",
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
        color: "#2f3337",
      }}
    >
      {/* centered top bar: console • tabs • profile all inside a centered container */}
      <div style={{ borderBottom: "1px solid #f0f2f4", background: "#fff" }}>
        <div
          style={{
            maxWidth: 1120,
            height: 48,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "160px 1fr 160px",
            alignItems: "center",
            padding: "0 12px",
          }}
        >
          {/* left: console word (like logo) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <strong style={{ color: "#2f6bd7", letterSpacing: 0.2 }}>console</strong>
          </div>

          {/* middle: tabs centered */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", gap: 24, fontSize: 12, color: muted }}>
              <span 
                onClick={() => setActiveTab("Dashboard")}
                style={{ 
                  cursor: "pointer",
                  color: activeTab === "Dashboard" ? "#2f3337" : muted,
                  borderBottom: activeTab === "Dashboard" ? "2px solid #1259ff" : "none",
                  paddingBottom: 10 
                }}
              >
                Dashboard
              </span>
              <span 
                onClick={() => setActiveTab("Portfolio")}
                style={{ 
                  cursor: "pointer",
                  color: activeTab === "Portfolio" ? "#2f3337" : muted,
                  borderBottom: activeTab === "Portfolio" ? "2px solid #1259ff" : "none",
                  paddingBottom: 10 
                }}
              >
                Portfolio
              </span>
              <span 
                onClick={() => setActiveTab("Reports")}
                style={{ 
                  cursor: "pointer",
                  color: activeTab === "Reports" ? "#2f3337" : muted,
                  borderBottom: activeTab === "Reports" ? "2px solid #1259ff" : "none",
                  paddingBottom: 10 
                }}
              >
                Reports
              </span>
              <span 
                onClick={() => setActiveTab("Funds")}
                style={{ 
                  cursor: "pointer",
                  color: activeTab === "Funds" ? "#2f3337" : muted,
                  borderBottom: activeTab === "Funds" ? "2px solid #1259ff" : "none",
                  paddingBottom: 10 
                }}
              >
                Funds
              </span>
              <span 
                onClick={() => setActiveTab("Account")}
                style={{ 
                  cursor: "pointer",
                  color: activeTab === "Account" ? "#2f3337" : muted,
                  borderBottom: activeTab === "Account" ? "2px solid #1259ff" : "none",
                  paddingBottom: 10 
                }}
              >
                Account
              </span>
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
                fontSize: 12,
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
      ) : (
        <div style={{ maxWidth: 1120, margin: "18px auto 40px", padding: "0 12px" }}>
        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 18V6l6 6 5-4 5 5v5H4Z" stroke="#2f3337" strokeWidth="1.6" />
          </svg>
          <div style={{ fontWeight: 700 }}>P&amp;L</div>
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select style={chip(140)}>
            <option defaultValue>Equity</option>
          </select>

          <div style={{ position: "relative" }}>
            <button style={{ ...comboBtn, width: 140 }}>
              <span style={{ color: "#6f7680", marginRight: 8 }}>P&amp;L</span>
              <strong style={{ color: "#2f3337" }}>Combined</strong>
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
                    fontSize: 12,
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
              height: 34,
              width: 34,
              cursor: "pointer",
            }}
            title="Apply"
          >
            →
          </button>
        </div>

        {/* months row (colored) */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 22, marginTop: 18 }}>
          {stripMonths.map((mLabel, i) => {
            // map OCT..DEC to previous year; JAN..SEP to current year
            const realMonthIndex = [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8][i];
            const yearForThis =
              realMonthIndex >= 9 ? baseYear - 1 : baseYear;
            return (
              <MonthMini key={mLabel} label={mLabel} year={yearForThis} monthIndex={realMonthIndex} />
            );
          })}
        </div>

        {/* summary bar */}
        <div
          style={{
            display: "flex",
            border: `1px solid ${border}`,
            borderRadius: 8,
            marginTop: 18,
            overflow: "hidden",
          }}
        >
          {[
            { title: "Realised P&L", value: `+${asMoney(data.realisedTotal)}`, color: "#0aa86f" },
            { title: "Charges & taxes", value: asMoney(data.charges) },
            { title: "Other credits & debits", value: asMoney(-134.52) },
            { title: "Net realised P&L", value: `+${asMoney(data.realisedTotal - 134.52 - data.charges)}`, color: "#0aa86f" },
            { title: "Unrealised P&L", value: "0" },
          ].map((c, i, arr) => (
            <div
              key={c.title}
              style={{
                flex: 1,
                minWidth: 140,
                padding: "14px 22px",
                borderRight: i === arr.length - 1 ? "none" : `1px solid ${border}`,
              }}
            >
              <div style={{ color: muted, fontSize: 12 }}>{c.title}</div>
              <div style={{ marginTop: 6, fontWeight: 700, color: c.color || "#2f3337" }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* table controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16, color: muted, fontSize: 12 }}>
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
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 12.5 }}>
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
                  <td style={{ ...tdCell, color: "#0aa86f", fontWeight: 600 }}>
                    +{asMoney(r.realised)}{" "}
                    <span style={{ color: "#8aa69e", fontWeight: 400, marginLeft: 6, fontSize: 11 }}>
                      +{(r.realised / (r.buyVal || 1) * 100).toFixed(2)}%
                    </span>
                  </td>
                  <td style={tdCell}>—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* footer note (compact, console-like) */}
        <div style={{ color: "#9aa1a8", fontSize: 10, marginTop: 26, lineHeight: 1.5 }}>
          © ZERODHA ® 2025. All rights reserved. NSE &amp; BSE – SEBI Registration no.: INZ000031633 |
          MCX – SEBI Registration no.: INZ000038238 | CDSL – SEBI Registration no.: IN-DP-431-2019.
          Disclaimer: The P&amp;L report/holdings/positions data is prepared based on the trades and information available
          with us at the time of report generation. Zerodha Broking Ltd. does not make any warranty, express or implied,
          or assume any legal/consequential liability, or responsibility, for the authenticity, or completeness of the
          data presented in this report/data. To double check your P&amp;L report/Holdings/Positions data, verify it
          with your Tradebook, Contract Notes and the Funds Statement which are available with you at all times.
        </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- small style helpers -------------------- */
const chip = (w) => ({
  width: w,
  height: 34,
  border: "1px solid #e7ebee",
  background: "#fff",
  borderRadius: 6,
  padding: "0 10px",
  fontSize: 12,
  color: "#2f3337",
});

const comboBtn = {
  height: 34,
  border: "1px solid #e7ebee",
  background: "#fff",
  borderRadius: 6,
  padding: "0 10px",
  fontSize: 12,
  display: "inline-flex",
  alignItems: "center",
};

const quickLink = { cursor: "pointer" };

const tdCell = {
  padding: "10px 12px",
  borderBottom: "1px solid #f3f5f7",
};
