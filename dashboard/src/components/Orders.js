import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const Orders = () => {
  const [allOrders, SetAllOrders] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    axios
      .get("https://zerodha-clone-backend-8nlf.onrender.com/orders/index", {
        headers: { Authorization: user },
      })
      .then((res) => SetAllOrders(res.data))
      .catch(() => SetAllOrders([]));
  }, []);

  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const page = { fontFamily: font, color: "#2f3337" };

  const tabs = {
    display: "flex",
    alignItems: "center",
    gap: 22,
    borderBottom: "1px solid #eceff2",
    padding: "8px 12px",
    marginBottom: 10,
  };
  const tab = { fontSize: 14, color: "#6f7680", paddingBottom: 10, cursor: "default" };
  const tabActive = { ...tab, color: "#ff6a3d", borderBottom: "2px solid #ff6a3d", fontWeight: 600 };

  const headerRow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    margin: "10px 0 6px",
  };
  const title = { margin: 0, fontSize: 18, fontWeight: 600, color: "#3a3f45" };

  const tools = { display: "flex", alignItems: "center", gap: 14 };
  const search = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #e8eaed",
    borderRadius: 4,
    padding: "6px 8px",
    color: "#6f7680",
    fontSize: 14,
    minWidth: 210,
    background: "#fff",
  };
  const linkBlue = { color: "#2f6bd7", fontSize: 13, textDecoration: "none", fontWeight: 500, cursor: "pointer" };

  const tableWrap = { borderTop: "1px solid #f0f2f4" };
  const table = { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 };
  const th = { textAlign: "left", padding: "12px 12px", color: "#8a9097", fontWeight: 500 };
  const td = { padding: "12px 12px", borderTop: "1px solid #f4f5f6", verticalAlign: "middle" };
  const tdRight = { ...td, textAlign: "right" };
  const tdGray = { ...tdRight, background: "#f8f9fb" };

  const badgeBUY = {
    fontSize: 11,
    fontWeight: 700,
    color: "#6a88ff",
    background: "#eef3ff",
    borderRadius: 4,
    padding: "2px 8px",
    display: "inline-block",
  };
  const tagComplete = {
    fontSize: 11,
    fontWeight: 700,
    color: "#28a745",
    background: "rgba(40,167,69,0.12)",
    borderRadius: 4,
    padding: "4px 8px",
    display: "inline-block",
  };

  const rowTime = (i) => {
    // simple stable time-ish string per row for the look
    const base = 9 * 3600 + 45 * 60 + (i % 60);
    const h = String(Math.floor(base / 3600)).padStart(2, "0");
    const m = String(Math.floor((base % 3600) / 60)).padStart(2, "0");
    const s = String(base % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div style={page}>
      {/* Tabs */}
      <div style={tabs}>
        <div style={tabActive}>Orders</div>
        <div style={tab}>GTT</div>
        <div style={tab}>Baskets</div>
        <div style={tab}>SIP</div>
        <div style={tab}>Alerts</div>
      </div>

      {/* Executed orders */}
      <div style={headerRow}>
        <h3 style={title}>Executed orders ({allOrders.length})</h3>
        <div style={tools}>
          <div style={search}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
              <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span>Search</span>
          </div>
          <a style={linkBlue}>Contract note</a>
          <a style={linkBlue}>View history</a>
          <a style={linkBlue}>Download</a>
        </div>
      </div>

      <div className="order-table" style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...th, width: 120 }}>Time</th>
              <th style={{ ...th, width: 100 }}>Type</th>
              <th style={th}>Instrument</th>
              <th style={{ ...th, width: 120 }}>Product</th>
              <th style={{ ...th, width: 110, textAlign: "right" }}>Qty.</th>
              <th style={{ ...th, width: 120, textAlign: "right" }}>Avg. price</th>
              <th style={{ ...th, width: 120 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((o, i) => (
              <tr key={`eo-${i}`}>
                <td style={td}>{rowTime(280 + i * 46)}</td>
                <td style={td}>
                  <span style={badgeBUY}>{(o.mode || "BUY").toUpperCase()}</span>
                </td>
                <td style={td}>
                  <span style={{ fontWeight: 600 }}>{o.name}</span>
                  <span style={{ marginLeft: 6, color: "#9aa1a8", fontSize: 11 }}>NSE</span>
                </td>
                <td style={td}>MIS</td>
                <td style={tdRight}>
                  {o.qty} / {o.qty}
                </td>
                <td style={tdRight}>{Number(o.price).toFixed(2)}</td>
                <td style={td}>
                  <span style={tagComplete}>COMPLETE</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Trades */}
        <div style={{ ...headerRow, marginTop: 22 }}>
          <h3 style={title}>
            Trades <span style={{ fontWeight: 500 }}>( {allOrders.length} )</span>
          </h3>
          <div style={tools}>
            <div style={search}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
                <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Search</span>
            </div>
            <a style={linkBlue}>View history</a>
            <a style={linkBlue}>Download</a>
          </div>
        </div>

        <table style={{ ...table, marginBottom: 10 }}>
          <thead>
            <tr>
              <th style={{ ...th, width: 160 }}>Trade ID</th>
              <th style={{ ...th, width: 120 }}>Fill time</th>
              <th style={{ ...th, width: 100 }}>Type</th>
              <th style={th}>Instrument</th>
              <th style={{ ...th, width: 120 }}>Product</th>
              <th style={{ ...th, width: 90, textAlign: "right" }}>Qty.</th>
              <th style={{ ...th, width: 120, textAlign: "right" }}>Avg. Price</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((o, i) => (
              <tr key={`tr-${i}`}>
                <td style={td}>{String(601358000 + i * 172).padStart(8, "0")}</td>
                <td style={td}>{rowTime(280 + i * 46)}</td>
                <td style={td}>
                  <span style={badgeBUY}>{(o.mode || "BUY").toUpperCase()}</span>
                </td>
                <td style={td}>
                  <span style={{ fontWeight: 600 }}>{o.name}</span>
                  <span style={{ marginLeft: 6, color: "#9aa1a8", fontSize: 11 }}>NSE</span>
                </td>
                <td style={td}>MIS</td>
                <td style={tdRight}>{o.qty}</td>
                <td style={tdGray}>{Number(o.price).toString().replace(/(\.\d{2})\d*/, "$1")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
