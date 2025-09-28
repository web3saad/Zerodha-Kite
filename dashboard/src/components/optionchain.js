// optionchain.js
import React from "react";

/** OptionChain – static UI clone matching the screenshot */
const OptionChain = () => {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const page = {
    fontFamily: font,
    color: "#2f3337",
    background: "#fff",
    padding: "12px 16px",
  };

  const topBar = {
    display: "flex",
    alignItems: "center",
    gap: 16,
  };

  // const scrip = { fontSize: 18, fontWeight: 700, letterSpacing: 0.2 };
  const price = { fontSize: 14, marginLeft: 6, color: "#111" };
  const change = { fontSize: 12, marginLeft: 6, color: "#e53e3e" };

  const tabRow = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    marginBottom: 8,
  };
  const tab = {
    padding: "8px 10px",
    border: "1px solid #e7ebee",
    background: "#f8fafc",
    borderRadius: 18,
    fontSize: 12,
    cursor: "pointer",
  };
  const tabActive = {
    ...tab,
    background: "#e8f0ff",
    color: "#387ef5",
    borderColor: "#d3e2ff",
    fontWeight: 600,
  };

  const rightLinks = {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 14,
    fontSize: 12,
    color: "#2f6bd7",
  };

  const toggleWrap = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#6f7680",
  };

  const toggle = {
    width: 34,
    height: 18,
    background: "#e8edf3",
    borderRadius: 24,
    position: "relative",
  };

  const knob = {
    position: "absolute",
    top: 2,
    left: 18,
    width: 14,
    height: 14,
    background: "#fff",
    borderRadius: "50%",
    boxShadow: "0 1px 2px rgba(0,0,0,.16)",
  };

  const tableWrap = {
    marginTop: 10,
    border: "1px solid #eef1f4",
    borderRadius: 8,
    overflow: "hidden",
  };

  const table = {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    fontSize: 12.5,
  };

  const th = {
    position: "sticky",
    top: 0,
    zIndex: 1,
    background: "#fbfcfd",
    textAlign: "center",
    color: "#6f7680",
    fontWeight: 600,
    padding: "10px 8px",
    borderBottom: "1px solid #eef1f4",
  };

  const td = {
    padding: "8px",
    borderBottom: "1px solid #f3f5f7",
    textAlign: "center",
    background: "#fff",
  };

  const tdMuted = { color: "#8a9097" };
  const green = { color: "#0aa86f" };
  const red = { color: "#d84c4c" };

  const strikePill = {
    display: "inline-block",
    background: "#2f3337",
    color: "#fff",
    borderRadius: 12,
    padding: "2px 8px",
    fontSize: 11,
    fontWeight: 600,
  };

  const oiBarLeft = (pct, color = "#ef6767") => ({
    height: 2,
    width: `${pct}%`,
    background: color,
    borderRadius: 2,
  });
  const oiBarRight = (pct, color = "#64c98b") => ({
    height: 2,
    width: `${pct}%`,
    background: color,
    borderRadius: 2,
    marginLeft: "auto",
  });

  // minimal rows around ATM 950 to match look
  const rows = [
    { callOI: "39.42", callOIChg: "+19.03%", callLTP: "7.75", strike: "950", putLTP: "9.20", putOI: "30.77", putOIChg: "17.23%", atm: true, leftBar: 58, rightBar: 60 },
    { callOI: "68.86", callOIChg: "57.21%", callLTP: "4.35", strike: "960", putLTP: "15.55", putOI: "31.35", putOIChg: "-32.35%", leftBar: 82, rightBar: 22 },
    { callOI: "108.23", callOIChg: "8.10%", callLTP: "2.70", strike: "970", putLTP: "24.30", putOI: "36.72", putOIChg: "-12.87%", leftBar: 95, rightBar: 35 },
    { callOI: "78.63", callOIChg: "2.13%", callLTP: "1.70", strike: "980", putLTP: "32.95", putOI: "20.22", putOIChg: "-2.82%", leftBar: 72, rightBar: 20 },
    { callOI: "42.87", callOIChg: "-11.51%", callLTP: "1.15", strike: "990", putLTP: "42.70", putOI: "9.78", putOIChg: "-3.05%", leftBar: 48, rightBar: 10 },
    { callOI: "27.52", callOIChg: "2.33%", callLTP: "0.55", strike: "1010", putLTP: "60.25", putOI: "6.30", putOIChg: "-0.81%", leftBar: 36, rightBar: 8 },
  ];

  const footer = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 16,
    padding: "16px 6px 4px",
    color: "#6f7680",
    fontSize: 12,
  };
  const footVal = { fontSize: 14, color: "#2f3337", fontWeight: 600, marginTop: 4 };

  return (
    <div style={page}>
      {/* Header */}
      <div style={topBar}>

        <div style={price}>945.75</div>
        <div style={change}>-11.45 (-1.20%)</div>

        <div style={tabRow}>
          <span style={tabActive}>30 Sep (6 days)</span>
          <span style={tab}>28 Oct (1 month)</span>
          <span style={tab}>25 Nov (2 months)</span>
          <span style={{ ...tabActive, width: 34, textAlign: "center", padding: "8px 0" }}>OI</span>
          <span style={{ ...tab, cursor: "default", background: "transparent", border: "none", color: "#6f7680" }}>
            Greeks
          </span>
        </div>

        <div style={rightLinks}>
          <span>Search</span>
          <span>Settings</span>
          <span>Popout</span>
          <span style={toggleWrap}>
            Basket
            <span style={toggle}>
              <span style={knob} />
            </span>
          </span>
        </div>
      </div>

      {/* Table */}
      <div style={tableWrap}>
        <table style={table}>
          <thead>
            <tr>
              <th style={{ ...th, width: 160 }}>OI (in lakhs)</th>
              <th style={{ ...th, width: 120 }}>Call LTP</th>
              <th style={{ ...th, width: 100 }}>Strike</th>
              <th style={{ ...th, width: 120 }}>Put LTP</th>
              <th style={{ ...th, width: 160 }}>OI (in lakhs)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {/* Left OI */}
                <td style={{ ...td, textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 80 }}>
                      <div style={oiBarLeft(r.leftBar, "#ef6a6a")} />
                    </div>
                    <div>
                      <div>{r.callOI}</div>
                      <div style={{ ...tdMuted, fontSize: 11 }}>
                        {r.callOIChg.startsWith("-") ? (
                          <span style={red}>{r.callOIChg}</span>
                        ) : (
                          <span style={green}>{r.callOIChg}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Call LTP */}
                <td style={td}>
                  <div>{r.callLTP}</div>
                </td>

                {/* Strike */}
                <td style={td}>
                  {r.atm ? <span style={strikePill}>{r.strike}</span> : <span>{r.strike}</span>}
                </td>

                {/* Put LTP */}
                <td style={td}>
                  <div>{r.putLTP}</div>
                </td>

                {/* Right OI */}
                <td style={{ ...td, textAlign: "right" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                    <div>
                      <div>{r.putOI}</div>
                      <div style={{ ...tdMuted, fontSize: 11, textAlign: "right" }}>
                        {r.putOIChg.startsWith("-") ? (
                          <span style={red}>{r.putOIChg}</span>
                        ) : (
                          <span style={green}>{r.putOIChg}</span>
                        )}
                      </div>
                    </div>
                    <div style={{ width: 80 }}>
                      <div style={oiBarRight(r.rightBar, "#64c98b")} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer stats */}
        <div style={footer}>
          <div>
            PCR
            <div style={footVal}>0.47</div>
          </div>
          <div>
            Max Pain
            <div style={footVal}>960</div>
          </div>
          <div>
            ATM IV
            <div style={footVal}>17.40</div>
          </div>
          <div>
            IV Percentile
            <div style={footVal}>50.00 - High</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionChain;
