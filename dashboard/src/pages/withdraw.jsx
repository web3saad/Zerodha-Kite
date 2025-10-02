import React from "react";

const Withdraw = () => {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const page = {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: font,
    color: "#2f3337",
    fontWeight: 400, // ensure normal weight everywhere
  };

  const container = {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "24px 20px 48px",
  };

  const header = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    fontSize: 32,       // smaller
    fontWeight: 400,    // not bold
    color: "#2f3337",
    paddingBottom: 14,
    borderBottom: "1px solid #eef1f4",
  };

  const card = {
    marginTop: 24,
    border: "1px solid #eef1f4",
    borderRadius: 10,
    boxShadow: "0 8px 24px rgba(0,0,0,.04)",
    overflow: "hidden",
    background: "#fff",
  };

  const row = { display: "flex", alignItems: "stretch" };

  const left = { flex: 1, padding: "28px 36px" };

  const right = {
    width: 480,                  // a bit narrower
    borderLeft: "1px solid #eef1f4",
    padding: "28px 36px",
  };

  const sectionTitle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 24,     // smaller
    fontWeight: 400,  // not bold
    marginBottom: 14,
  };

  const meta = { color: "#6f7680", fontSize: 14, lineHeight: 1.6 };

  const inputWrap = {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginTop: 20,
  };

  const input = {
    flex: 1,
    height: 44,               // smaller
    border: "1px solid #e7ebee",
    borderRadius: 8,
    padding: "0 14px",
    fontSize: 16,             // smaller
    outline: "none",
    fontWeight: 400,
  };

  const cta = {
    height: 44,               // smaller
    minWidth: 150,
    borderRadius: 8,
    background: "#0b59d6",
    color: "#fff",
    fontSize: 16,             // smaller
    fontWeight: 400,          // not bold
    border: "none",
    cursor: "pointer",
  };

  const radios = {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginTop: 18,
    color: "#2f3337",
    fontSize: 16,            // smaller
    fontWeight: 400,
  };

  const radioDot = (checked) => ({
    width: 16,
    height: 16,
    borderRadius: "50%",
    border: `2px solid ${checked ? "#0b59d6" : "#cfd6dc"}`,
    boxShadow: checked ? "inset 0 0 0 4px #0b59d6" : "none",
    marginRight: 8,
  });

  const kv = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 16,             // smaller
    padding: "12px 0",
    color: "#2f3337",
    fontWeight: 400,
  };

  const helpBlue = { color: "#0b59d6", textDecoration: "none", fontWeight: 400 };

  const small = { color: "#6f7680", fontSize: 14, fontWeight: 400 };

  return (
    <div style={page}>
      <div style={container}>
        {/* Page title */}
        <div style={header}>
          <span
            aria-hidden
            style={{
              width: 32,
              height: 24,
              borderRadius: 6,
              border: "2px solid #2f3337",
              position: "relative",
              display: "inline-block",
            }}
          >
            <span
              style={{
                position: "absolute",
                width: 16,
                height: 2,
                background: "#2f3337",
                left: 7,
                top: 11,
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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

              <div style={{ ...kv, paddingTop: 14 }}>
                <span style={{ fontSize: 18, color: "#0b59d6", fontWeight: 400 }}>
                  Withdrawable balance{" "}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ marginLeft: 6, verticalAlign: "-2px" }}
                  >
                    <circle cx="12" cy="12" r="9" stroke="#0b59d6" strokeWidth="2" />
                    <path d="M12 8h.01M12 11v5" stroke="#0b59d6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <span style={{ fontSize: 22, color: "#0b59d6", fontWeight: 400 }}>₹0.90</span>
              </div>

              <div style={{ marginTop: 18, display: "flex", justifyContent: "flex-end" }}>
                <a href="#" style={{ ...helpBlue, fontSize: 14 }}>
                  View breakdown <span aria-hidden style={{ marginLeft: 6 }}>→</span>
                </a>
              </div>

              <div style={{ marginTop: 4, textAlign: "right", ...small }} />
            </div>
          </div>
        </div>
      </div>

      {/* footer disclaimer */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '40px 20px', 
        marginTop: 40, 
        borderTop: '1px solid #e5e7eb' 
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
  );
};

export default Withdraw;
