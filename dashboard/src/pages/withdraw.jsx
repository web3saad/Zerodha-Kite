import React from "react";

const Withdraw = () => {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const page = {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: font,
    color: "#2f3337",
  };

  const container = {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "28px 24px 60px",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: 40,
    fontWeight: 800,
    color: "#2f3337",
    paddingBottom: 18,
    borderBottom: "1px solid #eef1f4",
  };

  const card = {
    marginTop: 28,
    border: "1px solid #eef1f4",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,.04)",
    overflow: "hidden",
    background: "#fff",
  };

  const row = {
    display: "flex",
    alignItems: "stretch",
  };

  const left = {
    flex: 1,
    padding: "36px 44px",
  };

  const right = {
    width: 520,
    borderLeft: "1px solid #eef1f4",
    padding: "36px 44px",
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 18,
  };

  const meta = { color: "#6f7680", fontSize: 16, lineHeight: 1.7 };

  const inputWrap = {
    display: "flex",
    alignItems: "center",
    gap: 18,
    marginTop: 26,
  };

  const input = {
    flex: 1,
    height: 54,
    border: "1px solid #e7ebee",
    borderRadius: 10,
    padding: "0 16px",
    fontSize: 18,
    outline: "none",
  };

  const cta = {
    height: 54,
    minWidth: 180,
    borderRadius: 10,
    background: "#0b59d6",
    color: "#fff",
    fontSize: 20,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
  };

  const radios = {
    display: "flex",
    alignItems: "center",
    gap: 26,
    marginTop: 24,
    color: "#2f3337",
    fontSize: 18,
  };

  const radioDot = (checked) => ({
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: `2px solid ${checked ? "#0b59d6" : "#cfd6dc"}`,
    boxShadow: checked ? "inset 0 0 0 5px #0b59d6" : "none",
    marginRight: 10,
  });

  const kv = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 20,
    padding: "14px 0",
    color: "#2f3337",
  };

  const helpBlue = { color: "#0b59d6", textDecoration: "none", fontWeight: 700 };

  const small = { color: "#6f7680", fontSize: 18 };

  return (
    <div style={page}>
      <div style={container}>
        {/* Page title */}
        <div style={header}>
          <span
            aria-hidden
            style={{
              width: 38,
              height: 28,
              borderRadius: 6,
              border: "3px solid #2f3337",
              position: "relative",
              display: "inline-block",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: 18,
                height: 3,
                background: "#2f3337",
                left: 7,
                top: 12,
              }}
            />
          </span>
          <span>Funds</span>
        </div>

        {/* Card */}
        <div style={card}>
          <div style={row}>
            {/* Left column */}
            <div style={left}>
              <div style={sectionTitle}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#2f3337" strokeWidth="2" />
                  <path d="M12 7v6l4 2" stroke="#2f3337" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Equity
              </div>

              <div style={meta}>
                <div>Last updated: 2025-09-24 04:51:28</div>
                <div style={{ marginTop: 2 }}>
                  Next quarterly settlement on 2025-10-03.{" "}
                  <a href="#" style={helpBlue}>
                    Learn more
                  </a>
                  .
                </div>
              </div>

              <div style={inputWrap}>
                <input style={input} placeholder="Amount to withdraw" />
                <button style={cta}>Continue</button>
              </div>

              <div style={radios}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <span style={radioDot(true)} />
                  Regular (24–48 hours)
                </label>

                <label style={{ display: "flex", alignItems: "center", color: "#6f7680" }}>
                  <span style={radioDot(false)} />
                  Instant (Max: ₹200000)
                </label>
              </div>
            </div>

            {/* Right column */}
            <div style={right}>
              <div style={kv}>
                <span>Closing balance</span>
                <span>₹0.90</span>
              </div>
              <div style={kv}>
                <span>Unsettled credits (–)</span>
                <span>₹0.00</span>
              </div>
              <div style={kv}>
                <span>Payin (–)</span>
                <span>₹0.00</span>
              </div>
              <div style={kv}>
                <span>Collateral utilised (+)</span>
                <span>₹0.00</span>
              </div>

              <div style={{ ...kv, paddingTop: 18 }}>
                <span style={{ fontSize: 24, color: "#0b59d6", fontWeight: 800 }}>
                  Withdrawable balance{" "}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginLeft: 6, verticalAlign: "-2px" }}
                  >
                    <circle cx="12" cy="12" r="9" stroke="#0b59d6" strokeWidth="2" />
                    <path d="M12 8h.01M12 11v5" stroke="#0b59d6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span style={{ fontSize: 28, color: "#0b59d6", fontWeight: 800 }}>₹0.90</span>
              </div>

              <div style={{ marginTop: 22, display: "flex", justifyContent: "flex-end" }}>
                <a href="#" style={{ ...helpBlue, fontSize: 18 }}>
                  View breakdown{" "}
                  <span aria-hidden style={{ marginLeft: 6 }}>
                    →
                  </span>
                </a>
              </div>

              <div style={{ marginTop: 6, textAlign: "right", ...small }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Withdraw;
