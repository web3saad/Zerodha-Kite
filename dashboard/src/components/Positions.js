import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const Positions = () => {
  const [allPositions, SetAllPositions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("https://zerodha-clone-backend-8nlf.onrender.com/positions/index", {
        headers: { Authorization: user },
      })
      .then((res) => SetAllPositions(res.data));
  }, []);

  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const wrap = {
    fontFamily: font,
    color: "#2f3337",
  };

  const headerRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  };

  const title = { margin: 0, fontSize: 20, fontWeight: 600 };

  const tools = {
    display: "flex",
    alignItems: "center",
    gap: 14,
  };

  const search = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e9ecef",
    borderRadius: 4,
    padding: "6px 8px",
    color: "#6f7680",
    fontSize: 14,
    minWidth: 210,
  };

  const linkBlue = {
    color: "#2f6bd7",
    fontSize: 13,
    textDecoration: "none",
    fontWeight: 500,
    cursor: "pointer",
  };

  const tableWrap = {
    borderTop: "1px solid #f0f2f4",
  };

  const table = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 14,
  };

  const th = {
    textAlign: "left",
    padding: "12px 12px",
    color: "#6f7680",
    fontWeight: 500,
  };

  const td = {
    padding: "12px 12px",
    borderTop: "1px solid #f4f5f6",
    verticalAlign: "middle",
  };

  const tdGray = { ...td, background: "#f8f9fb" }; // for LTP column look
  const tdRight = { ...td, textAlign: "right" };

  const badge = {
    fontSize: 11,
    fontWeight: 600,
    color: "#a66a00",
    background: "#ffe9cc",
    borderRadius: 4,
    padding: "2px 6px",
    display: "inline-block",
  };

  const checkbox = { width: 16, height: 16 };

  const dotMenu = {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#9aa1a8",
    boxShadow: "0 6px 0 #9aa1a8, 0 -6px 0 #9aa1a8",
    display: "inline-block",
  };

  const red = { color: "#e04f3d", fontWeight: 500 };
  const green = { color: "#1aa774", fontWeight: 500 };

  const totalPL = allPositions.reduce((acc, s) => {
    const curr = s.price * s.qty;
    return acc + (curr - s.avg * s.qty);
  }, 0);

  // Breakdown bars (relative widths)
  const bars = allPositions.map((s) => ({
    label: `${s.name} (MIS)`,
    value: Math.abs(s.price * s.qty) || 0.0001,
  }));
  const maxBar = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div style={wrap}>
      {/* Positions header + tools */}
      <div style={headerRow}>
        <h3 className="title" style={title}>
          Positions ({allPositions.length})
        </h3>
        <div style={tools}>
          <div style={search}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
              <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </div>
          <a style={linkBlue}>Analytics</a>
          <a style={linkBlue}>Download</a>
        </div>
      </div>

      {/* Positions table */}
      <div className="order-table" style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...th, width: 32 }} />
              <th style={{ ...th, width: 120 }}>Product</th>
              <th style={th}>Instrument</th>
              <th style={{ ...th, width: 80, textAlign: "right" }}>Qty.</th>
              <th style={{ ...th, width: 100, textAlign: "right" }}>Avg.</th>
              <th style={{ ...th, width: 100, textAlign: "right" }}>LTP</th>
              <th style={{ ...th, width: 110, textAlign: "right" }}>P&amp;L</th>
              <th style={{ ...th, width: 90, textAlign: "right" }}>Chg.</th>
              <th style={{ ...th, width: 28 }} />
            </tr>
          </thead>
          <tbody>
            {allPositions.map((s, i) => {
              const currValue = s.price * s.qty;
              const pnl = currValue - s.avg * s.qty;
              const isProfit = pnl >= 0;
              const chgIsLoss = s.isLoss;

              return (
                <tr key={i}>
                  <td style={td}>
                    <input type="checkbox" style={checkbox} />
                  </td>
                  <td style={td}>
                    <span style={badge}>MIS</span>
                  </td>
                  <td style={td}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ marginLeft: 6, color: "#9aa1a8", fontSize: 11 }}>NSE</span>
                  </td>
                  <td style={tdRight}>{s.qty}</td>
                  <td style={tdRight}>{s.avg.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...tdGray }}>{s.price.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...(isProfit ? green : red) }}>{pnl.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...(chgIsLoss ? red : green) }}>{s.day}</td>
                  <td style={td}>
                    <span style={dotMenu} />
                  </td>
                </tr>
              );
            })}
            {/* Total P&L row */}
            <tr>
              <td colSpan={7} style={{ ...td, textAlign: "right", color: "#6f7680" }}>
                Total P&amp;L
              </td>
              <td style={{ ...tdRight, ...(totalPL >= 0 ? green : red) }}>{totalPL.toFixed(2)}</td>
              <td style={td} />
            </tr>
          </tbody>
        </table>

        {/* Day's history */}
        <div style={{ ...headerRow, marginTop: 28 }}>
          <h3 style={{ ...title, fontSize: 18, fontWeight: 600, margin: 0 }}>
            Day&apos;s history ({allPositions.length})
          </h3>
          <div style={tools}>
            <div style={search}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
                <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Search</span>
            </div>
            <a style={linkBlue}>Download</a>
          </div>
        </div>

        <table style={{ ...table, marginTop: 8 }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 120 }}>Product</th>
              <th style={th}>Instrument</th>
              <th style={{ ...th, width: 80, textAlign: "right" }}>Qty.</th>
              <th style={{ ...th, width: 100, textAlign: "right" }}>Avg.</th>
              <th style={{ ...th, width: 100, textAlign: "right" }}>LTP</th>
              <th style={{ ...th, width: 110, textAlign: "right" }}>P&amp;L</th>
              <th style={{ ...th, width: 90, textAlign: "right" }}>Chg.</th>
            </tr>
          </thead>
          <tbody>
            {allPositions.map((s, i) => {
              const currValue = s.price * s.qty;
              const pnl = currValue - s.avg * s.qty;
              const isProfit = pnl >= 0;
              const chgIsLoss = s.isLoss;

              return (
                <tr key={`h-${i}`}>
                  <td style={td}>
                    <span style={badge}>MIS</span>
                  </td>
                  <td style={td}>
                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                    <span style={{ marginLeft: 6, color: "#9aa1a8", fontSize: 11 }}>NSE</span>
                  </td>
                  <td style={tdRight}>{s.qty}</td>
                  <td style={tdRight}>{s.avg.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...tdGray }}>{s.price.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...(isProfit ? green : red) }}>{pnl.toFixed(2)}</td>
                  <td style={{ ...tdRight, ...(chgIsLoss ? red : green) }}>{s.day}</td>
                </tr>
              );
            })}

            <tr>
              <td colSpan={5} style={{ ...td, textAlign: "right", color: "#6f7680" }}>
                Total P&amp;L
              </td>
              <td style={{ ...tdRight, ...(totalPL >= 0 ? green : red) }}>{totalPL.toFixed(2)}</td>
              <td style={td} />
            </tr>
          </tbody>
        </table>

        {/* Breakdown */}
        <h3 style={{ ...title, fontSize: 18, fontWeight: 600, marginTop: 28 }}>Breakdown</h3>
        <div style={{ padding: "8px 0 24px" }}>
          <div style={{ maxWidth: 820 }}>
            {bars.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", margin: "18px 0 18px 36px" }}>
                <div
                  style={{
                    height: 10,
                    width: `${(b.value / maxBar) * 72}%`,
                    background: "#ff6b3d",
                    borderRadius: 2,
                  }}
                />
                <div style={{ marginLeft: 10, fontSize: 11.5, color: "#6f7680" }}>{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Positions;
