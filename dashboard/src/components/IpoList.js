import React, { useMemo, useState } from "react";

const font =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

const IpoList = () => {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () => [
      { name: "GANESHCP", sub: "Ganesh Consumer Products", date: "22nd — 24th Sep", price: "306 - 322", min: 14812, lots: 46, action: "Apply" },
      { name: "ATLANTELE", sub: "Atlante Electricals", date: "22nd — 24th Sep", price: "718 - 754", min: 14326, lots: 19, action: "Apply" },
      { name: "SOLARWORLD", sub: "Solarworld Energy Solutions", date: "23rd — 25th Sep", price: "333 - 351", min: 14742, lots: 42, action: "Apply" },
      { name: "ARSSBL", sub: "Anand Rathi Share And Stock Brokers", date: "23rd — 25th Sep", price: "393 - 414", min: 14904, lots: 36, action: "Apply" },
      { name: "STYL", sub: "Seshassal Technologies", date: "23rd — 25th Sep", price: "402 - 423", min: 14805, lots: 35, action: "Apply" },
      { name: "JARO", sub: "Jaro Institute of Technology Management and Research", date: "23rd — 25th Sep", price: "846 - 890", min: 14240, lots: 16, action: "Apply" },
      { name: "SOLVEX", sub: "Solvex Edibles", date: "22nd — 24th Sep", price: "72", min: 230400, lots: 3200, action: "Apply" },
      { name: "PRIMECAB", sub: "Prime Cable Industries", date: "22nd — 24th Sep", price: "78 - 83", min: 265600, lots: 3200, action: "Apply" },
      { name: "ECOLINE", sub: "Ecoline Exim", date: "23rd — 25th Sep", price: "134 - 141", min: 282000, lots: 2000, action: "Apply" },
      { name: "TRUECOLRS", sub: "True Colors", date: "23rd — 25th Sep", price: "181 - 191", min: 229200, lots: 1200, action: "Apply" },
      { name: "BHARATROHN", sub: "Bharatrohan Airborne Innovations", date: "23rd — 25th Sep", price: "80 - 85", min: 272000, lots: 3200, action: "Apply" },
      { name: "MGSL", sub: "Matrix Geo Solutions", date: "23rd — 25th Sep", price: "98 - 104", min: 249600, lots: 2400, action: "Apply" },
      { name: "APPL", sub: "Aptus Pharma", date: "23rd — 25th Sep", price: "65 - 70", min: 280000, lots: 4000, action: "Apply" },
      { name: "NSBBDPO", sub: "NSB BPO Solutions", date: "23rd — 25th Sep", price: "140 - 147", min: 294000, lots: 2000, action: "Apply" },
      { name: "BMVWENTLTD", sub: "BMW Ventures", date: "24th — 26th Sep", price: "94 - 99", min: 14949, lots: 151, action: "Pre-apply" },
      { name: "JAINREC", sub: "Jain Resource Recycling", date: "24th — 26th Sep", price: "220 - 232", min: 14848, lots: 64, action: "Pre-apply" },
      { name: "EPACKPEB", sub: "Epack Prefab Technologies", date: "24th — 26th Sep", price: "194 - 204", min: 14892, lots: 72, action: "Apply" },
    ],
    []
  );

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.sub.toLowerCase().includes(query.toLowerCase())
  );

  const styles = {
    page: { fontFamily: font, color: "#2f3337" },
    tabs: {
      display: "flex",
      alignItems: "center",
      gap: 18,
      borderBottom: "1px solid #eceff2",
      padding: "8px 12px",
      marginBottom: 8,
    },
    tab: { fontSize: 14, color: "#6f7680", paddingBottom: 10 },
    tabActive: {
      fontSize: 14,
      color: "#ff6a3d",
      borderBottom: "2px solid #ff6a3d",
      paddingBottom: 10,
      fontWeight: 600,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "8px 0",
      marginTop: 4,
      marginBottom: 6,
    },
    title: { margin: 0, fontSize: 18, fontWeight: 600, color: "#3a3f45" },
    tools: { display: "flex", alignItems: "center", gap: 12 },
    search: {
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
    },
    tableWrap: {
      border: "1px solid #eef1f4",
      borderRadius: 6,
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: 0,
      fontSize: 14,
    },
    th: {
      textAlign: "left",
      padding: "12px 16px",
      color: "#8a9097",
      fontWeight: 500,
      background: "#fafbfc",
      borderBottom: "1px solid #eef1f4",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid #f3f4f6",
      verticalAlign: "middle",
      background: "#fff",
    },
    name: { display: "flex", alignItems: "center", gap: 8 },
    sme: {
      fontSize: 10.5,
      fontWeight: 700,
      color: "#7ea8ff",
      background: "#eef5ff",
      borderRadius: 3,
      padding: "2px 6px",
      textTransform: "uppercase",
      letterSpacing: 0.3,
    },
    sub: { marginTop: 2, color: "#9aa1a8", fontSize: 12 },
    price: { color: "#2f3337", fontWeight: 500 },
    minAmt: { textAlign: "right", fontWeight: 600 },
    lots: { marginTop: 2, color: "#9aa1a8", fontSize: 12 },
    btn: {
      border: "none",
      background: "#4f86ff",
      color: "#fff",
      fontWeight: 600,
      padding: "8px 14px",
      borderRadius: 6,
      cursor: "pointer",
    },
    btnSecondary: {
      border: "none",
      background: "#3b7cff",
      color: "#fff",
      fontWeight: 600,
      padding: "8px 14px",
      borderRadius: 6,
      cursor: "pointer",
      opacity: 0.95,
    },
  };

  return (
    <div style={styles.page}>
      {/* Tabs */}
      <div style={styles.tabs}>
        <div style={styles.tabActive}>IPO</div>
        <div style={styles.tab}>Gov. securities</div>
        <div style={styles.tab}>Auctions</div>
        <div style={styles.tab}>Corporate actions</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={styles.search}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#9aa1a8" strokeWidth="1.6" />
              <path d="M20 20L17 17" stroke="#9aa1a8" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              style={{ border: "none", outline: "none", width: 140, fontSize: 14, color: "#2f3337" }}
            />
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>IPOs ({filtered.length})</h3>
        <div style={styles.tools}>
          {/* right area intentionally empty to match screenshot spacing */}
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={{ ...styles.th, width: "45%" }}>Instrument</th>
              <th style={{ ...styles.th, width: "20%" }}>Date</th>
              <th style={{ ...styles.th, width: "15%" }}>Price (₹)</th>
              <th style={{ ...styles.th, width: "15%", textAlign: "right" }}>Min. amount (₹)</th>
              <th style={{ ...styles.th, width: "5%" }} />
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr key={r.name}>
                <td style={styles.td}>
                  <div style={styles.name}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name} <span style={styles.sme}>sme</span></div>
                      <div style={styles.sub}>{r.sub}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{r.date}</td>
                <td style={{ ...styles.td, ...styles.price }}>{r.price}</td>
                <td style={{ ...styles.td, ...styles.minAmt }}>
                  {r.min.toLocaleString("en-IN")}
                  <div style={styles.lots}>{r.lots} Qty.</div>
                </td>
                <td style={styles.td}>
                  <button
                    style={r.action === "Pre-apply" ? styles.btnSecondary : styles.btn}
                  >
                    {r.action}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IpoList;
