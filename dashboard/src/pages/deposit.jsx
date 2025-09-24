// deposit.jsx — centered “Deposit funds” screen, styled to match your screenshot exactly
import React from "react";

const Deposit = () => {
  const page = {
    minHeight: "100vh",
    background: "#f6f7fb", // soft grey like screenshot
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 16px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    color: "#2f3337",
  };

  const card = {
    width: 560,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 8px 30px rgba(0,0,0,.06)",
    border: "1px solid #eef1f4",
  };

  const inner = { padding: "28px 32px 24px" };

  const topBrand = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#2f6bd7",
    fontWeight: 700,
    letterSpacing: 0.2,
    marginBottom: 6,
  };

  const title = {
    textAlign: "center",
    margin: 0,
    paddingBottom: 18,
    fontSize: 22,
    fontWeight: 700,
    color: "#2f3337",
  };

  const rowBetween = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    color: "#6f7680",
    fontSize: 14,
  };

  const label = {
    fontSize: 12,
    color: "#6f7680",
    margin: "14px 0 6px",
  };

  const inputWrap = {
    position: "relative",
    width: "100%",
  };

  const input = {
    width: "100%",
    height: 42,
    border: "1px solid #e7ebee",
    borderRadius: 6,
    padding: "0 12px 0 40px",
    outline: "none",
    fontSize: 14,
    color: "#2f3337",
    background: "#fff",
  };

  const leftIcon = {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9aa1a8",
    fontSize: 14,
  };

  const select = {
    width: "100%",
    height: 42,
    border: "1px solid #e7ebee",
    borderRadius: 6,
    padding: "0 36px 0 12px",
    outline: "none",
    fontSize: 14,
    color: "#2f3337",
    appearance: "none",
    background:
      "#fff url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%239aa1a8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"/></svg>') no-repeat right 12px center",
    backgroundSize: 16,
  };

  const subnote = {
    marginTop: 6,
    fontSize: 11.5,
    color: "#9aa1a8",
  };

  const link = { color: "#2f6bd7", textDecoration: "none" };

  const radios = {
    display: "flex",
    alignItems: "center",
    gap: 18,
    marginTop: 8,
  };

  const badge = {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: 700,
    color: "#19a35b",
    background: "rgba(25,163,91,.12)",
    border: "1px solid rgba(25,163,91,.35)",
    padding: "2px 6px",
    borderRadius: 999,
  };

  const fee = {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: 600,
    color: "#6f7680",
    background: "#f3f5f8",
    border: "1px solid #e7ebee",
    padding: "2px 6px",
    borderRadius: 999,
  };

  const btn = {
    width: "100%",
    height: 42,
    marginTop: 18,
    background: "#387ef5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  };

  const foot = {
    padding: "0 32px 24px",
    textAlign: "center",
    fontSize: 12,
    color: "#8b9197",
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={inner}>
          {/* brand */}
          <div style={topBrand}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M4 12 10 6v12L4 12Z" fill="#ff6a3d" />
            </svg>
            <span>ZERODHA</span>
          </div>

          <h2 style={title}>Deposit funds</h2>

          {/* name + user */}
          <div style={rowBetween}>
            <span>Mahammad Sayad</span>
            <span style={{ color: "#8b9197" }}>FJP018</span>
          </div>

          {/* Amount */}
          <div>
            <div style={label}>Amount</div>
            <div style={inputWrap}>
              <span style={leftIcon}>₹</span>
              <input style={input} placeholder="Enter amount" />
            </div>
          </div>

          {/* Segment */}
          <div>
            <div style={label}>Segment</div>
            <select style={select} defaultValue="eq">
              <option value="eq">Equity/Derivatives/Currency</option>
              <option value="mcx">Commodity</option>
            </select>
          </div>

          {/* Account */}
          <div>
            <div style={label}>Account</div>
            <select style={select} defaultValue="dcb">
              <option value="dcb">DCB BANK LTD - XXX 2877</option>
              <option value="icici">ICICI BANK - XXX 1023</option>
            </select>
            <div style={subnote}>
              Add another bank account from <a href="#" style={link}>Console</a>.
            </div>
          </div>

          {/* VPA */}
          <div>
            <div style={label}>Virtual payment address (UPI ID)</div>
            <input style={{ ...input, paddingLeft: 12 }} defaultValue="9606776950-2@ybl" />
          </div>

          {/* Payment mode */}
          <div>
            <div style={label}>Payment mode</div>
            <div style={radios}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="radio" name="pmode" defaultChecked />
                <span>UPI</span>
                <span style={badge}>FREE</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="radio" name="pmode" />
                <span>Net banking</span>
                <span style={fee}>₹9 + GST</span>
              </label>
            </div>
          </div>

          <button style={btn}>CONTINUE</button>
        </div>

        <div style={foot}>
          <a href="#" style={link}>
            Click here
          </a>{" "}
          to know more about other payment methods (IMPS/NEFT/RTGS).
        </div>
      </div>
    </div>
  );
};

export default Deposit;
