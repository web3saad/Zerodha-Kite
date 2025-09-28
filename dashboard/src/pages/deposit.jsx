import React from "react";

const Deposit = () => {
  const page = {
    minHeight: "100vh",
    background: "#f5f6fa",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 12px",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    color: "#2f3337",
    fontWeight: 400,
  };

  const card = {
    width: 480,
    background: "#fff",
    borderRadius: 8,
    boxShadow: "0 8px 24px rgba(0,0,0,.06)",
    border: "1px solid #edf0f3",
  };

  const inner = { padding: "20px 24px 16px" };

  const topBrand = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    color: "#2f6bd7",
    letterSpacing: 0.2,
    marginBottom: 2,
    fontSize: 16,
    fontWeight: 500,
  };

  const title = {
    textAlign: "center",
    margin: 0,
    paddingBottom: 14,
    fontSize: 26,
    fontWeight: 600,
    color: "#2f3337",
  };

  const rowBetween = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    color: "#6f7680",
    fontSize: 16,
  };

  const field = { marginTop: 10 };

  const label = {
    fontSize: 16,
    color: "#6f7680",
    margin: "12px 0 8px",
    fontWeight: 600,
  };

  const inputWrap = { position: "relative", width: "100%" };

  const input = {
    width: "100%",
    height: 48,
    border: "1px solid #e7ebee",
    borderRadius: 6,
    padding: "0 14px 0 38px",
    outline: "none",
    fontSize: 16,
    color: "#2f3337",
    background: "#fff",
    boxSizing: "border-box",
  };

  const leftIcon = {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9aa1a8",
    fontSize: 13,
  };

  const select = {
    width: "100%",
    height: 48,
    border: "1px solid #e7ebee",
    borderRadius: 6,
    padding: "0 34px 0 12px",
    outline: "none",
    fontSize: 16,
    color: "#2f3337",
    appearance: "none",
    background:
      "#fff url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"%239aa1a8\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"6 9 12 15 18 9\"/></svg>') no-repeat right 10px center",
    backgroundSize: 16,
    boxSizing: "border-box",
  };

  const subnote = {
    marginTop: 6,
    fontSize: 13,
    color: "#9aa1a8",
  };

  const link = { color: "#2f6bd7", textDecoration: "none" };

  const radios = {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginTop: 8,
    fontSize: 16,
  };

  const badge = {
    marginLeft: 8,
    fontSize: 11,
    color: "#19a35b",
    background: "rgba(25,163,91,.12)",
    border: "1px solid rgba(25,163,91,.35)",
    padding: "2px 6px",
    borderRadius: 999,
  };

  const fee = {
    marginLeft: 8,
    fontSize: 11,
    color: "#6f7680",
    background: "#f3f5f8",
    border: "1px solid #e7ebee",
    padding: "2px 6px",
    borderRadius: 999,
  };

  const btn = {
    width: "100%",
    height: 48,
    marginTop: 16,
    background: "#2f6bd7",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    boxSizing: "border-box",
  };

  const foot = {
    padding: "0 24px 16px",
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M4 12 10 6v12L4 12Z" fill="#ff6a3d" />
            </svg>
            <span>ZERODHA</span>
          </div>

          <h2 style={title}>Deposit funds</h2>

          {/* name + id */}
          <div>
            <div style={rowBetween}>
              <span style={{ color: "#2f3337" }}>Mahammad Sayad</span>
              <span style={{ color: "#8b9197" }}>FJP018</span>
            </div>
            <div style={{ height: 1, background: "#eceff3", marginBottom: 8 }} />
          </div>

          {/* Amount */}
          <div style={field}>
            <div style={label}>Amount</div>
            <div style={inputWrap}>
              <span style={leftIcon}>₹</span>
              <input style={input} placeholder="Enter amount" />
            </div>
          </div>

          {/* Segment */}
          <div style={field}>
            <div style={label}>Segment</div>
            <select style={select} defaultValue="eq" aria-label="Segment">
              <option value="eq">Equity/Derivatives/Currency</option>
              <option value="mcx">Commodity</option>
            </select>
          </div>

          {/* Account */}
          <div style={field}>
            <div style={label}>Account</div>
            <select style={select} defaultValue="dcb" aria-label="Account">
              <option value="dcb">DCB BANK LTD - XXX 2877</option>
              <option value="icici">ICICI BANK - XXX 1023</option>
            </select>
            <div style={subnote}>
              Add another bank account from <button style={link}>Console</button>.
            </div>
          </div>

          {/* VPA */}
          <div style={field}>
            <div style={label}>Virtual payment address (UPI ID)</div>
            <input
              style={{ ...input, paddingLeft: 12 }}
              defaultValue="9606776950-2@ybl"
              aria-label="UPI ID"
            />
          </div>

          {/* Payment mode */}
          <div style={field}>
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
          <button style={link}>
            Click here
          </a>{" "}
          to know more about other payment methods (IMPS/NEFT/RTGS).
        </div>
      </div>
    </div>
  );
};

export default Deposit;
