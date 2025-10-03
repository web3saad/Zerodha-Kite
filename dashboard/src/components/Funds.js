import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from '../utils/api';

export default function Funds() {
  const [fundsData, setFundsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  useEffect(() => {
    fetchFundsData();
  }, []);

  const fetchFundsData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/funds`);
      const data = await response.json();
      setFundsData(data);
    } catch (error) {
      console.error('Error fetching funds data:', error);
    } finally {
      setLoading(false);
    }
  };

  const wrap = { fontFamily: font, fontWeight: 400, color: "#2f3337" };

  const banner = {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    marginBottom: 12,
  };
  const bannerText = { flex: 1, textAlign: "center", color: "#8a9097", fontSize: 13, fontWeight: 400 };
  const btn = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "none",
    textDecoration: "none",
    fontSize: 13,
    lineHeight: 1,
    fontWeight: 400,
    whiteSpace: "nowrap",
  };
  const btnGreen = { ...btn, background: "#36b24a", color: "#fff" };
  const btnBlue = { ...btn, background: "#4777ff", color: "#fff", marginLeft: 8 };

  const twoCol = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 };

  const panel = { background: "#fff" };
  const head = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 };
  const headLeft = { display: "flex", alignItems: "center", gap: 8 };
  const iconRing = { width: 14, height: 14, border: "2px solid #a2a7ae", borderRadius: "50%" };
  const htext = { margin: 0, fontSize: 16, fontWeight: 400, color: "#2f3337" };
  const headLinks = { display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#2f6bd7" };
  const dot = { width: 6, height: 6, background: "#2f6bd7", borderRadius: "50%", display: "inline-block" };

  const card = { border: "1px solid #e9ecef", borderRadius: 6, overflow: "hidden" };
  const row = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px" };
  const label = { margin: 0, color: "#6f7680", fontSize: 14 };
  const val = { margin: 0, color: "#2f3337", fontSize: 14 };
  const valBig = { ...val, fontSize: 28, color: "#3f76ff" };
  const hr = { border: 0, borderTop: "1px solid #e9ecef", margin: 0 };
  const shaded = { background: "#f6f7f8" };

  const INR = (n) => {
    const num = typeof n === 'string' ? parseFloat(n) : n;
    return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  if (loading) {
    return (
      <div style={{ ...wrap, padding: '2rem', textAlign: 'center' }}>
        <p>Loading funds data...</p>
      </div>
    );
  }

  if (!fundsData) {
    return (
      <div style={{ ...wrap, padding: '2rem', textAlign: 'center' }}>
        <p>Error loading funds data. Please try again.</p>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');`}</style>

      {/* Banner */}
      <div style={banner}>
        <div style={{ width: 120 }} />
        <p style={bannerText}>Instant, zero-cost fund transfers with <span style={{ fontWeight: 400 }}>UPI</span></p>
        <div>
          <Link to="/deposit" style={btnGreen}>Add funds</Link>
          <Link to="/withdraw" style={btnBlue}>Withdraw</Link>
        </div>
      </div>

      {/* Two columns */}
      <div style={twoCol}>
        {/* Equity */}
        <div style={panel}>
          <div style={head}>
            <div style={headLeft}>
              <span style={iconRing} />
              <p style={htext}>Equity</p>
            </div>
            <div style={headLinks}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={dot} /> View statement
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={dot} /> Help
              </span>
            </div>
          </div>

          <div style={card}>
            <div style={row}>
              <p style={label}>Available margin</p>
              <p style={valBig}>{INR(fundsData.equity.availableMargin)}</p>
            </div>
            <div style={{ ...row, ...shaded }}>
              <p style={label}>Used margin</p>
              <p style={val}>{INR(fundsData.equity.usedMargin)}</p>
            </div>
            <div style={row}>
              <p style={label}>Available cash</p>
              <p style={valBig}>{INR(fundsData.equity.availableCash)}</p>
            </div>
            <hr style={hr} />
            <div style={{ ...row, ...shaded }}>
              <p style={label}>Opening balance</p>
              <p style={val}>{INR(fundsData.equity.openingBalance)}</p>
            </div>
            {[
              { label: "Payin", key: "payin" },
              { label: "Payout", key: "payout" },
              { label: "SPAN", key: "span" },
              { label: "Delivery margin", key: "deliveryMargin" },
              { label: "Exposure", key: "exposure" },
              { label: "Options premium", key: "optionsPremium" },
            ].map((item, i) => (
              <div key={i} style={row}>
                <p style={label}>{item.label}</p>
                <p style={val}>{INR(fundsData.equity[item.key])}</p>
              </div>
            ))}
            <hr style={hr} />
            {[
              { label: "Collateral (Liquid funds)", key: "collateralLiquidFunds" },
              { label: "Collateral (Equity)", key: "collateralEquity" },
              { label: "Total collateral", key: "totalCollateral" }
            ].map((item, i) => (
              <div key={i} style={row}>
                <p style={label}>{item.label}</p>
                <p style={val}>{INR(fundsData.equity[item.key])}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Commodity */}
        <div style={panel}>
          <div style={head}>
            <div style={headLeft}>
              <span style={iconRing} />
              <p style={htext}>Commodity</p>
            </div>
            <div style={headLinks}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={dot} /> View statement
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={dot} /> Help
              </span>
            </div>
          </div>

          <div style={card}>
            <div style={row}>
              <p style={label}>Available margin</p>
              <p style={valBig}>{INR(fundsData.commodity.availableMargin)}</p>
            </div>
            <div style={{ ...row, ...shaded }}>
              <p style={label}>Used margin</p>
              <p style={val}>{INR(fundsData.commodity.usedMargin)}</p>
            </div>
            <div style={row}>
              <p style={label}>Available cash</p>
              <p style={valBig}>{INR(fundsData.commodity.availableCash)}</p>
            </div>
            <hr style={hr} />
            <div style={{ ...row, ...shaded }}>
              <p style={label}>Opening balance</p>
              <p style={val}>{INR(fundsData.commodity.openingBalance)}</p>
            </div>
            {[
              { label: "Payin", key: "payin" },
              { label: "Payout", key: "payout" },
              { label: "SPAN", key: "span" },
              { label: "Delivery margin", key: "deliveryMargin" },
              { label: "Exposure", key: "exposure" },
              { label: "Options premium", key: "optionsPremium" },
            ].map((item, i) => (
              <div key={i} style={row}>
                <p style={label}>{item.label}</p>
                <p style={val}>{INR(fundsData.commodity[item.key])}</p>
              </div>
            ))}
            <hr style={hr} />
            {[
              { label: "Collateral (Liquid funds)", key: "collateralLiquidFunds" },
              { label: "Collateral (Equity)", key: "collateralEquity" },
              { label: "Total collateral", key: "totalCollateral" }
            ].map((item, i) => (
              <div key={i} style={row}>
                <p style={label}>{item.label}</p>
                <p style={val}>{INR(fundsData.commodity[item.key])}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
