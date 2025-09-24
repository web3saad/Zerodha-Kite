import { BarChartOutlined, MoreHoriz } from "@mui/icons-material";
import { Grow, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

function WatchListAction({ uid, symbol = "HDFCBANK", bse = "₹945.15", nse = "₹945.10" }) {
  const [showTicket, setShowTicket] = useState(false);
  const [side, setSide] = useState("buy"); // "buy" | "sell"
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(945.15);
  const [intraday, setIntraday] = useState(false);
  const navigate = useNavigate();

  const openBuy = () => { setSide("buy"); setShowTicket(true); };
  const openSell = () => { setSide("sell"); setShowTicket(true); };
  const closeTicket = () => setShowTicket(false);
  const openChart = () => {
    navigate(`/chart/${symbol}`);
  };

  // ===== Styles =====
  const overlay = {
    position: "fixed",
    inset: 0,
    background: "transparent", // keep UI clean; change to 'rgba(0,0,0,.08)' if you want a dim
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,              // above everything
  };

  const card = {
    width: 320,
    borderRadius: 6,
    boxShadow: "0 12px 32px rgba(0,0,0,.18)",
    background: "#fff",
    border: "1px solid #e7ebee",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    color: "#2f3337",
    // prevent accidental text selection dragging causing weird hides
    userSelect: "none",
  };

  const head = {
    padding: "10px 12px",
    borderRadius: "6px 6px 0 0",
    color: "#fff",
    background: side === "buy" ? "#4777ff" : "#ff5b2e",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };
  const headLeft = { display: "flex", flexDirection: "column", gap: 4 };
  const exch = { display: "flex", alignItems: "center", gap: 10, fontSize: 12, opacity: 0.95 };
  const pillDot = { width: 8, height: 8, borderRadius: 999, border: "2px solid #fff", display: "inline-block" };
  const body = { padding: 12, background: "#fff" };
  const tabs = {
    display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#7a828a",
    borderBottom: "1px solid #eef1f4", marginBottom: 8,
  };
  const tabActive = {
    padding: "8px 0", color: side === "buy" ? "#4777ff" : "#ff5b2e",
    borderBottom: `2px solid ${side === "buy" ? "#4777ff" : "#ff5b2e"}`, marginBottom: -1,
  };
  const field = {
    border: "1px solid #e8eaed", borderRadius: 4, padding: 10, marginTop: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between",
  };
  const label = { fontSize: 12, color: "#7a828a", marginBottom: 4 };
  const input = { fontSize: 18, fontWeight: 600, color: "#2f3337", border: "none", outline: "none", width: "100%", background: "transparent" };
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, fontSize: 13 };
  const smallBlue = { color: "#2f6bd7", fontWeight: 500, cursor: "pointer" };
  const primaryBtn = {
    width: "100%", border: "none", borderRadius: 6, marginTop: 12, padding: "10px 12px",
    color: "#fff", fontWeight: 600, background: side === "buy" ? "#4777ff" : "#ff5b2e", cursor: "pointer",
  };
  const secondaryBtn = {
    width: "100%", border: "1px solid #d9dee3", borderRadius: 6, marginTop: 8,
    padding: "10px 12px", background: "#fafbfc", color: "#2f3337", fontWeight: 600, cursor: "pointer",
  };

  return (
    <>
      <span className="actions">
        <span>
          <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
            <button className="buy" onClick={openBuy}>Buy</button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
            <button className="sell" onClick={openSell}>Sell</button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
            <button className="action" onClick={openChart}><BarChartOutlined className="icon" /></button>
          </Tooltip>
        </span>
        <span>
          <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
            <button className="action"><MoreHoriz className="icon" /></button>
          </Tooltip>
        </span>
      </span>

      {/* Centered ticket rendered in a portal so it never hides on mouse move */}
      {showTicket &&
        createPortal(
          <div style={overlay} onClick={closeTicket}>
            <div
              style={card}
              onClick={(e) => e.stopPropagation()} // keep clicks inside from closing
            >
              {/* Header */}
              <div style={head}>
                <div style={headLeft}>
                  <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>{symbol}</div>
                  <div style={exch}>
                    <span><span style={{ ...pillDot, borderColor: "#fff" }} /> BSE <b style={{ marginLeft: 4 }}>{bse}</b></span>
                    <span style={{ opacity: 0.65 }}><span style={{ ...pillDot, borderColor: "#fff", opacity: 0.65 }} /> NSE <b style={{ marginLeft: 4 }}>{nse}</b></span>
                  </div>
                </div>
                <div
                  role="switch"
                  aria-checked={side === "buy"}
                  onClick={() => setSide(side === "buy" ? "sell" : "buy")}
                  style={{ width: 34, height: 18, borderRadius: 12, background: "rgba(255,255,255,.35)", position: "relative", cursor: "pointer" }}
                >
                  <span style={{ position: "absolute", top: 2, left: side === "buy" ? 18 : 2, width: 14, height: 14, borderRadius: "50%", background: "#fff", transition: "left .15s ease" }} />
                </div>
              </div>

              {/* Body */}
              <div style={body}>
                <div style={tabs}>
                  <span style={tabActive}>Quick</span>
                  <span>Regular</span>
                  <span style={{ opacity: 0.5 }}>Iceberg</span>
                  <span style={{ marginLeft: "auto", opacity: 0.6 }}>✎</span>
                </div>

                <div>
                  <div style={label}>Qty.</div>
                  <div style={field}>
                    <input
                      type="number"
                      min={1}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                      style={input}
                    />
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <button onClick={() => setQty((q) => q + 1)} style={{ border: "1px solid #e8eaed", background: "#fff", borderRadius: 3, width: 22, height: 18, cursor: "pointer" }}>▲</button>
                      <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={{ border: "1px solid #e8eaed", background: "#fff", borderRadius: 3, width: 22, height: 18, cursor: "pointer" }}>▼</button>
                    </div>
                  </div>
                </div>

                <div>
                  <div style={label}>Price</div>
                  <div style={field}>
                    <input
                      type="number"
                      step="0.05"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      style={input}
                    />
                    <button onClick={() => setPrice("")} style={{ border: "none", background: "transparent", color: "#a0a7ad", fontWeight: 700, cursor: "pointer" }}>×</button>
                  </div>
                </div>

                <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={intraday} onChange={(e) => setIntraday(e.target.checked)} />
                  <span style={{ fontSize: 13, color: "#6f7680" }}>Intraday</span>
                </div>

                <div style={{ ...row, color: "#6f7680" }}>
                  <div>
                    Req.{" "}
                    <b style={{ color: side === "buy" ? "#4777ff" : "#ff5b2e" }}>
                      ₹{(Math.max(0, price) * qty).toFixed(2)}
                    </b>{" "}
                    <span style={{ color: "#9aa1a8" }}>+0.99</span>
                  </div>
                  <div>
                    Avail. <b style={{ color: "#ff5b2e" }}>₹279.80</b>{" "}
                    <span title="Refresh" style={{ ...smallBlue, marginLeft: 6 }}>↻</span>
                  </div>
                </div>

                <button style={primaryBtn}>{side === "buy" ? "Buy" : "Sell"}</button>
                <button style={secondaryBtn} onClick={closeTicket}>Cancel</button>
              </div>
            </div>
          </div>,
          document.body
        )}

    </>
  );
}

export default WatchListAction;
