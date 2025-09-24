import React from "react";
import { Link } from "react-router-dom";

// Prefer Inter if you have it; otherwise fall back to system UI
const fontStack =
  "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

const row = { display: "flex", gap: 24, alignItems: "stretch" };

// No border around the header area
const card = {
  fontFamily: fontStack,
  flex: 1,
  background: "#fff",
  border: "none",
  borderRadius: 6,
  padding: 16,
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 8,
};

const headLeft = { display: "flex", alignItems: "center", gap: 8 };
const tinyIcon = {
  width: 14,
  height: 14,
  border: "2px solid #a2a7ae", // lighter stroke like ref
  borderRadius: "50%",
};

const headingText = {
  margin: 0,
  fontSize: 18,
  fontWeight: 500, // was bolder
  color: "#2f3337",
  letterSpacing: 0.1,
};

// Links on the right of the heading
const helperLinks = {
  display: "flex",
  alignItems: "center",
  gap: 18,
  fontSize: 13,
  color: "#2f6bd7", // closer to reference blue
  fontWeight: 500,  // medium, not bold
};

// Bordered content area starts after header
const tableShell = {
  border: "1px solid #e9ecef",
  borderRadius: 6,
  marginTop: 8,
};

const tr = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 18px",
};

const label = {
  margin: 0,
  color: "#6f7680",  // softer gray
  fontSize: 15,
  fontWeight: 400,   // regular like the screenshot
};

const val = {
  margin: 0,
  color: "#2f3337",
  fontSize: 15,
  fontWeight: 500,   // medium, not bold
};

const valBigBlue = {
  ...val,
  fontSize: 30,      // big but light
  fontWeight: 500,
  color: "#1876f2",
};

const divider = { border: 0, borderTop: "1px solid #e9ecef", margin: 0 };
const shaded = { background: "#f6f7f8" };

// Banner styles (top row)
const bannerWrap = {
  fontFamily: fontStack,
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  marginBottom: 12,
};
const bannerCenter = {
  flex: 1,
  textAlign: "center",
  color: "#9aa1a8",
  fontSize: 13.5,
  fontWeight: 400,
};
const ctas = { display: "flex", gap: 10 };
const btnBase = {
  padding: "14px 28px",   // bigger height & width
      // rounder corners like the screenshot
  fontWeight: 600,
  border: "none",
  textDecoration: "none",
  fontSize: 18,           // larger text
  lineHeight: 1.1,
};

const btnGreen = { ...btnBase, background: "#61c46e", color: "#fff" };
const btnBlue  = { ...btnBase, background: "#4777ff", color: "#fff" };

const Funds = () => {
  return (
    <>
      {/* Top banner */}
      <div className="funds" style={bannerWrap}>
        <div style={{ width: 120 }} />
        <p style={bannerCenter}>
          Instant, zero-cost fund transfers with <b>UPI</b>
        </p>
        <div style={ctas}>
          <Link className="btn btn-green" style={btnGreen}>
            Add funds
          </Link>
          <Link className="btn btn-blue" style={btnBlue}>
            Withdraw
          </Link>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="row" style={row}>
        {/* Equity */}
        <div className="col" style={card}>
          <div style={cardHeader}>
            <div style={headLeft}>
              <span style={tinyIcon} aria-hidden />
              <p style={headingText}>Equity</p>
            </div>
            <div style={helperLinks}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#2f6bd7", borderRadius: "50%" }} />
                View statement
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#2f6bd7", borderRadius: "50%" }} />
                Help
              </span>
            </div>
          </div>

          <div style={tableShell}>
            <div className="data" style={tr}>
              <p style={label}>Available margin</p>
              <p className="imp colored" style={valBigBlue}>0.90</p>
            </div>
            <div className="data" style={{ ...tr, ...shaded }}>
              <p style={label}>Used margin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Available cash</p>
              <p style={valBigBlue}>0.90</p>
            </div>

            <hr style={divider} />

            <div className="data" style={{ ...tr, ...shaded }}>
              <p style={label}>Opening balance</p>
              <p style={val}>0.90</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Payin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Payout</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>SPAN</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Delivery margin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Exposure</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Options premium</p>
              <p style={val}>0.00</p>
            </div>

            <hr style={divider} />

            <div className="data" style={tr}>
              <p style={label}>Collateral (Liquid funds)</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Collateral (Equity)</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Total Collateral</p>
              <p style={val}>0.00</p>
            </div>
          </div>
        </div>

        {/* Commodity */}
        <div className="col" style={card}>
          <div style={cardHeader}>
            <div style={headLeft}>
              <span style={tinyIcon} aria-hidden />
              <p style={headingText}>Commodity</p>
            </div>
            <div style={helperLinks}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#2f6bd7", borderRadius: "50%" }} />
                View statement
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, background: "#2f6bd7", borderRadius: "50%" }} />
                Help
              </span>
            </div>
          </div>

          <div style={tableShell}>
            <div className="data" style={tr}>
              <p style={label}>Available margin</p>
              <p style={valBigBlue}>0.00</p>
            </div>
            <div className="data" style={{ ...tr, ...shaded }}>
              <p style={label}>Used margin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Available cash</p>
              <p style={valBigBlue}>0.00</p>
            </div>

            <hr style={divider} />

            <div className="data" style={{ ...tr, ...shaded }}>
              <p style={label}>Opening balance</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Payin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Payout</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>SPAN</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Delivery margin</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Exposure</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Options premium</p>
              <p style={val}>0.00</p>
            </div>

            <hr style={divider} />

            <div className="data" style={tr}>
              <p style={label}>Collateral (Liquid funds)</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Collateral (Equity)</p>
              <p style={val}>0.00</p>
            </div>
            <div className="data" style={tr}>
              <p style={label}>Total Collateral</p>
              <p style={val}>0.00</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
