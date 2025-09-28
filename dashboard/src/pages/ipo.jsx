import React, { useState, useEffect } from "react";

export default function IPOApply() {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const [qty, setQty] = useState(150);
  const [price, setPrice] = useState(100);
  const [ipoData, setIpoData] = useState({
    name: "NXST",
    sub: "Nexus Select Trust",
    date: "22nd — 24th Sep",
    price: "306 - 322",
    min: 14812,
    lots: 46,
    action: "Apply"
  });

  // Read IPO data from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('name')) {
      setIpoData({
        name: urlParams.get('name') || "NXST",
        sub: urlParams.get('sub') || "Nexus Select Trust",
        date: urlParams.get('date') || "22nd — 24th Sep",
        price: urlParams.get('price') || "306 - 322",
        min: parseInt(urlParams.get('min')) || 14812,
        lots: parseInt(urlParams.get('lots')) || 46,
        action: urlParams.get('action') || "Apply"
      });
    }
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        .inter { font-family: ${font}; font-weight: 400; color:#2f3337 }
        .wrap { max-width: 980px; margin: 0 auto; padding: 18px 20px 28px; }
        .grid { display:grid; grid-template-columns: 1fr 1fr; gap: 26px; }
        .muted { color:#8a9097 }
        .title { font-size:26px; margin:0 0 2px; font-weight:400; }
        .subtitle { font-size:14px; color:#8a9097; margin:0 0 16px; }
        .kvs { display:grid; grid-template-columns: 180px 1fr; row-gap:18px; }
        .label { color:#8a9097; font-size:15px }
        .value { color:#2f3337; font-size:15px }
        .link { color:#2f6bd7; text-decoration:none; font-size:14px }
        .openIcon { width:14px; height:14px; margin-left:6px; vertical-align:-2px }
        .note { background:#f6f7f8; border:1px solid #eceff2; border-radius:6px; padding:16px; color:#4a5056; font-size:14px; line-height:1.6 }
        .panel { border:1px solid #eceff2; border-radius:6px; padding:18px; }
        .row { display:flex; align-items:center; gap:14px; }
        .upiHead { font-size:18px; margin:0 0 12px; color:#2f3337; font-weight:400 }
        .fieldLabel { font-size:12px; color:#8a9097; margin:0 0 6px; }
        .input { width:100%; border:1px solid #dfe3e7; border-radius:6px; padding:12px 12px; font-size:14px; outline:none }
        .select { width:100%; border:1px solid #dfe3e7; border-radius:6px; padding:12px 12px; font-size:14px; color:#6f7680; appearance: none; background:#fff url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%239aa1a8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>') no-repeat right 10px center }
        .tinyLink { color:#2f6bd7; font-size:12.5px; text-decoration:none }
        .rightRow { display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:14px }
        .addRow { display:flex; align-items:center; justify-content:flex-end; gap:10px; font-size:14px; color:#2f6bd7; cursor:pointer; margin: 10px 0 6px; }
        .hr { border:0; border-top:1px solid #eceff2; margin:18px 0 }
        .amountWrap { display:flex; align-items:center; justify-content:space-between; margin-top:8px }
        .amountLabel { color:#8a9097; font-size:18px }
        .amountVal { color:#29a54a; font-size:22px }
        .agree { display:flex; align-items:flex-start; gap:10px; font-size:14px; color:#2f3337; margin:22px 0 }
        .footer { display:flex; align-items:center; justify-content:flex-end; gap:12px; padding-top:16px; border-top:1px solid #eceff2 }
        .btn { padding:10px 16px; border-radius:8px; border:none; background:#e9edf2; color:#2f3337; font-size:14px; cursor:pointer }
        .btn.blue { background:#4777ff; color:#fff }
      `}</style>

      <div className="wrap inter">
        <div className="grid">
          {/* LEFT: issue summary */}
          <div>
            <h1 className="title">{ipoData.name}</h1>
            <div className="subtitle">{ipoData.sub}</div>

            <div className="kvs" style={{ marginBottom: 18 }}>
              <div className="label">Investor type</div>
              <div className="value">Individual investor</div>

              <div className="label">Issue dates</div>
              <div className="value">{ipoData.date}</div>

              <div className="label">Issue size (no of shares)</div>
              <div className="value">{(ipoData.min * ipoData.lots).toLocaleString("en-IN")}</div>

              <div className="label">Issue price range</div>
              <div className="value">₹{ipoData.price}</div>

              <div className="label">Lot size</div>
              <div className="value">{ipoData.lots}</div>

              <div className="label">Minimum amount</div>
              <div className="value">₹{ipoData.min.toLocaleString("en-IN")}</div>
            </div>

            <div className="row" style={{ gap: 22, marginBottom: 18 }}>
              <button className="link" style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => alert('Red Herring Prospectus')}>Red Herring Prospectus <OpenIcon/></button>
              <button className="link" style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => alert('Subscription data')}>Subscription data <OpenIcon/></button>
            </div>

            <div className="note">
              REIT IPO applications can only be made in the Non-
              Individual Investor (NII) category with a maximum
              application size of Rs. 5 lakhs. As per SEBI
              regulations, applications made in the NII category
              cannot be cancelled and can only be modified
              upwards.
            </div>
          </div>

          {/* RIGHT: form */}
          <div>
            <h3 className="upiHead">UPI</h3>
            <div className="panel">
              <div className="row" style={{ gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <div className="fieldLabel">UPI ID</div>
                  <input className="input" placeholder="" />
                </div>
                <div style={{ width: 220 }}>
                  <div className="fieldLabel">&nbsp;</div>
                  <select className="select" defaultValue="">
                    <option value="" disabled>Your UPI Provider</option>
                    <option>Google Pay</option>
                    <option>PhonePe</option>
                    <option>Paytm</option>
                  </select>
                </div>
              </div>
              <div className="row" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="tinyLink" style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => alert('UPI provider help')}><InfoIcon/> UPI provider not listed?</button>
              </div>

              <h4 style={{ fontWeight: 400, margin: '16px 0 6px', fontSize: 18 }}>Bids (1/3)</h4>
              <div className="rightRow">
                <div>
                  <div className="fieldLabel">Qty.</div>
                  <input className="input" value={qty} onChange={e=>setQty(e.target.value)} />
                </div>
                <div>
                  <div className="fieldLabel">Price</div>
                  <input className="input" value={price} onChange={e=>setPrice(e.target.value)} />
                </div>
              </div>
              <div className="addRow">
                <button className="link" style={{border: 'none', background: 'none', cursor: 'pointer'}} onClick={() => alert('Add another bid')}>+ Add</button>
              </div>

              <hr className="hr" />

              <div className="amountWrap">
                <div className="amountLabel">Amount payable</div>
                <div className="amountVal">₹{Number(qty * price).toLocaleString('en-IN', {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agree row */}
        <label className="agree">
          <input type="checkbox" style={{ marginTop: 3 }} />
          <span>
            I agree to the <button className="link" style={{border: 'none', background: 'none', cursor: 'pointer', padding: 0}} onClick={() => alert('Terms and conditions')}>terms and conditions</button>.
          </span>
        </label>

        {/* Footer buttons */}
        <div className="footer">
          <button className="btn blue">Submit</button>
          <button className="btn">Close</button>
        </div>
      </div>
    </div>
  );
}

function OpenIcon(){
  return (
    <svg className="openIcon" viewBox="0 0 24 24" fill="none" stroke="#2f6bd7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 3h7v7"/>
      <path d="M21 3l-8 8"/>
      <path d="M5 7v12a2 2 0 0 0 2 2h12"/>
    </svg>
  )
}

function InfoIcon(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2f6bd7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="8"/>
      <path d="M12 12v4"/>
    </svg>
  )
}
