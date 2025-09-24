import React from "react";

const Summary = () => {
  // ---- shared styles ----
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";
  const page = { fontFamily: font, color: "#2f3337" };
  const divider = { border: 0, borderTop: "1px solid #eceff1", margin: "12px 0" };

  const chipDot = (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        background: "#2f6bd7",
        borderRadius: "50%",
        marginRight: 6,
      }}
    />
  );

  return (
    <>
      {/* Greeting */}
      <div className="username" style={{ ...page }}>
        <h6 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Hi, Muhammad</h6>
        <hr className="divider" style={divider} />
      </div>

      {/* Equity & Commodity row */}
      <div
        className="section"
        style={{
          ...page,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Equity */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              color: "#3a3f45",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #9aa1a8",
                display: "inline-block",
              }}
            />
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Equity</p>
          </div>

          <div
            className="data"
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1px 1fr",
              alignItems: "center",
              border: "1px solid #eceff1",
              borderRadius: 6,
              padding: "20px 16px",
              gap: 16,
            }}
          >
            {/* left big number */}
            <div className="first" style={{ textAlign: "left" }}>
              <div style={{ fontSize: 36, fontWeight: 400, color: "#3b3f44" }}>279.8</div>
              <p style={{ margin: 0, color: "#828b94", fontSize: 13 }}>Margin available</p>
            </div>

            {/* vertical rule */}
            <div style={{ width: 1, height: 56, background: "#eceff1", justifySelf: "center" }} />

            {/* right stats */}
            <div className="second" style={{ fontSize: 13, color: "#6f7680" }}>
              <p style={{ margin: "0 0 6px" }}>
                Margins used <span style={{ color: "#2f3337", fontWeight: 600 }}>21.1</span>
              </p>
              <p style={{ margin: 0 }}>
                Opening balance <span style={{ color: "#2f3337", fontWeight: 600 }}>0.9</span>
              </p>
              <div style={{ marginTop: 8, color: "#2f6bd7", fontWeight: 500, cursor: "pointer" }}>
                {chipDot}
                View statement
              </div>
            </div>
          </div>
        </div>

        {/* Commodity */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              color: "#3a3f45",
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: "50%",
                border: "2px solid #9aa1a8",
                display: "inline-block",
              }}
            />
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Commodity</p>
          </div>

          <div
            className="data"
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1px 1fr",
              alignItems: "center",
              border: "1px solid #eceff1",
              borderRadius: 6,
              padding: "20px 16px",
              gap: 16,
            }}
          >
            <div className="first" style={{ textAlign: "left" }}>
              <div style={{ fontSize: 36, fontWeight: 400, color: "#3b3f44" }}>0</div>
              <p style={{ margin: 0, color: "#828b94", fontSize: 13 }}>Margin available</p>
            </div>

            <div style={{ width: 1, height: 56, background: "#eceff1", justifySelf: "center" }} />

            <div className="second" style={{ fontSize: 13, color: "#6f7680" }}>
              <p style={{ margin: "0 0 6px" }}>
                Margins used <span style={{ color: "#2f3337", fontWeight: 600 }}>0</span>
              </p>
              <p style={{ margin: 0 }}>
                Opening balance <span style={{ color: "#2f3337", fontWeight: 600 }}>0</span>
              </p>
              <div style={{ marginTop: 8, color: "#2f6bd7", fontWeight: 500, cursor: "pointer" }}>
                {chipDot}
                View statement
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div style={{ ...page, textAlign: "center", padding: "48px 0 36px" }}>
        <div
          aria-hidden
          style={{
            width: 54,
            height: 40,
            margin: "0 auto 16px",
            border: "2px solid #d7dde3",
            borderRadius: 6,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              left: "50%",
              transform: "translateX(-50%)",
              width: 26,
              height: 10,
              border: "2px solid #d7dde3",
              borderBottom: 0,
              borderRadius: "6px 6px 0 0",
              background: "#fff",
            }}
          />
        </div>
        <p style={{ margin: 0, color: "#8b949e", fontSize: 13, lineHeight: 1.6 }}>
          You don&apos;t have any stocks in your DEMAT yet. Get started
          <br />
          with absolutely free equity investments.
        </p>
        <button
          style={{
            marginTop: 16,
            background: "#4777ff",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Start investing
        </button>
      </div>

      {/* Market overview + Positions */}
      <div
        style={{
          ...page,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
        }}
      >
        {/* Market overview */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              color: "#3a3f45",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderBottom: "2px solid #9aa1a8",
                borderLeft: "2px solid #9aa1a8",
                transform: "rotate(-45deg)",
                display: "inline-block",
              }}
            />
            <span>Market overview</span>
          </div>
          <div
            style={{
              border: "1px solid #eceff1",
              borderRadius: 6,
              height: 140,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* simple line to mimic chart */}
            <svg width="100%" height="100%" viewBox="0 0 400 140">
              <polyline
                fill="none"
                stroke="#4f7cff"
                strokeWidth="3"
                points="5,80 40,60 80,70 120,40 160,95 200,60 240,45 280,80 320,70 360,50 395,65"
              />
            </svg>
          </div>
        </div>

        {/* Positions */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
              color: "#3a3f45",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                border: "2px solid #9aa1a8",
                borderRadius: 2,
                display: "inline-block",
              }}
            />
            <span>Positions (2)</span>
          </div>

          <div style={{ border: "1px solid #eceff1", borderRadius: 6, padding: 12 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 4 }}>URJA (MIS)</div>
              <div
                style={{
                  height: 8,
                  background: "#e6edff",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "55%", height: "100%", background: "#4f7cff" }} />
              </div>
            </div>

            <div>
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 4 }}>YESBANK (MIS)</div>
              <div
                style={{
                  height: 8,
                  background: "#e6edff",
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <div style={{ width: "100%", height: "100%", background: "#4f7cff" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="divider" style={{ ...divider, marginTop: 16 }} />
    </>
  );
};

export default Summary;
