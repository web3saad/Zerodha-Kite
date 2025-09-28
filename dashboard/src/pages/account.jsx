import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";

export default function Account() {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  const [active, setActive] = useState("Personal");
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL || 'https://zerodha-kite-890j.onrender.com'}/api/account`);
        setAccountData(response.data);
      } catch (error) {
        console.error('Error fetching account data:', error);
        // Use default data if API fails
        setAccountData({
          personal: {
            email: "SAHADSAAD186@GMAIL.COM",
            mobile: "*6950",
            pan: "*182M"
          },
          demat: {
            dematId: "1208160149854261",
            dpId: "12081601",
            boId: "49854261",
            depositoryParticipant: "Zerodha Broking Limited",
            depository: "CDSL"
          },
          verifiedPL: {
            nameDisplay: "Full name",
            useAvatar: true,
            description: "",
            personalWebpage: "",
            segments: {
              equity: false,
              currency: false,
              futuresOptions: false,
              commodity: false
            },
            livePL: false,
            timelineDays: 30,
            displayTrades: true
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const sections = useMemo(
    () => [
      "Personal",
      "Nominees",
      "Bank",
      "Demat",
      "Segments",
      "Margin Trading Facility (MTF)",
      "Documents",
      "Commodity declaration",
      "Family",
      "Verified P&L",
    ],
    []
  );

  return (
    <div style={{ fontFamily: font, color: "#1f2328", background: "#fff", minHeight: "100vh", fontWeight: 400 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        .hair { border-top:1px solid #eceff2; }
        .muted { color:#6b7280 }
        .blue { color:#0b5bd3; text-decoration:none }
        .btn { background:#0b5bd3; border:none; color:#fff; padding:10px 14px; border-radius:6px; font-size:14px; cursor:pointer }
        .btn.ghost{ background:#eef2f7; color:#1f2328 }
        .select, .input { width:100%; border:1px solid #dfe3e7; border-radius:6px; padding:10px 12px; font-size:14px; outline:none; background:#fff }
        .row { display:flex; align-items:center; gap:14px }
        .kv { display:grid; grid-template-columns:110px 1fr; row-gap:10px }
        .cardLine { padding:12px 0; border-bottom:1px solid #f0f2f4 }
      `}</style>

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 24px 80px" }}>
        {/* Title */}
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 400 }}>Account</h1>

        {/* Summary header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 1fr 1fr",
            alignItems: "center",
            columnGap: 40,
            padding: "24px 0 22px",
            borderBottom: "1px solid #eceff2",
            marginTop: 14,
          }}
        >
          {/* Avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#eef0ff",
                color: "#5E63FF",
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              MS
            </div>
          </div>

          <KV title="Name" value="Mahammad Sayad" />

          <div className="kv">
            <div className="muted" style={{ fontSize: 14 }}>Client ID</div>
            <div style={{ fontSize: 16 }}>FJP018</div>
            <div className="muted" style={{ fontSize: 14 }}>Support code</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ letterSpacing: 2 }}>••••</span>
              <a className="blue" href="#">View</a>
            </div>
          </div>

          <KV title="CKYC no." value="300238795666432" />
        </div>

        {/* Body */}
        <div style={{ display: "grid", gridTemplateColumns: "310px 1fr", columnGap: 40, paddingTop: 24 }}>
          {/* Sidebar */}
          <nav aria-label="Sections" style={{ borderRight: "1px solid #eceff2", paddingRight: 24 }}>
            {sections.map((label) => {
              const activeNow = label === active;
              return (
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: activeNow ? "#f6f8fb" : "transparent",
                    color: activeNow ? "#0b5bd3" : "#1f2328",
                    border: "none",
                    padding: "14px 16px",
                    marginBottom: 4,
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Panel switcher */}
          <section>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Loading account data...
              </div>
            ) : (
              renderPanel(active, accountData)
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

/* ================= Panels ================= */

function PersonalPanel({ accountData }) {
  return (
    <>
      <h2 style={{ margin: "2px 0 20px", fontSize: 22, fontWeight: 400 }}>Personal</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 80, rowGap: 26 }}>
        <Field label="E-mail" value={accountData?.personal?.email || "SAHADSAAD186@GMAIL.COM"} editable />
        <Field label="Mobile" value={accountData?.personal?.mobile || "*6950"} editable />
        <Field label="PAN" value={accountData?.personal?.pan || "*182M"} />
      </div>
    </>
  );
}

function NomineesPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Nominees</h2>
      <p className="muted" style={{ maxWidth: 680, lineHeight: 1.6, fontSize: 14 }}>
        We will notify your nominee(s) in case your account becomes dormant due to inactivity for more than a year, and
        you do not come back and do a reKYC. <a className="blue" href="#">Learn more</a>.
      </p>
      <hr className="hair" />
      <div style={{ fontSize: 14, marginTop: 14 }}>
        Choice of nomination: <span className="muted">No nominee (Submitted)</span>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "flex-start" }}>
        <InfoIcon />
        <p className="muted" style={{ margin: 0, maxWidth: 760, lineHeight: 1.7, fontSize: 14 }}>
          Your nomination preference has been registered at the exchanges and CDSL. Your account complies with the SEBI
          circular regarding choice of nomination and your account will not be blocked for lack of a nominee. However,
          we encourage you to add a nominee in case of any eventuality.
        </p>
      </div>
      <div style={{ marginTop: 18 }}>
        <a className="blue" href="#">+ Add nominee(s)</a>
      </div>
    </>
  );
}

function BankPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Bank</h2>
      <div className="cardLine" style={{ display: "grid", gridTemplateColumns: "130px 1fr 1fr", columnGap: 32 }}>
        <div>
          <div className="muted" style={{ fontSize: 14 }}>Account</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span>••••••••••2877</span>
            <EyeIcon />
          </div>
        </div>
        <div>
          <div className="muted" style={{ fontSize: 14 }}>Bank</div>
          <div>DCB BANK LTD</div>
        </div>
        <div>
          <div className="muted" style={{ fontSize: 14 }}>Branch</div>
          <div>6 TULSIANI CHAMBERS</div>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <button className="btn">Add bank account</button>
      </div>
    </>
  );
}

function DematPanel({ accountData }) {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Demat</h2>
      <Tabs tabs={["Primary", "Secondary"]} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 60, rowGap: 18, marginTop: 12 }}>
        <KVRow k="Demat ID" v={accountData?.demat?.dematId || "1208160149854261"} s="For IPO application and CDSL TPIN authorisation" />
        <div />
        <KVRow k="DP ID" v={accountData?.demat?.dpId || "12081601"} />
        <KVRow k="BO ID" v={accountData?.demat?.boId || "49854261"} />
        <KVRow k="Depository Participant (DP)" v={accountData?.demat?.depositoryParticipant || "Zerodha Broking Limited"} />
        <KVRow k="Depository" v={accountData?.demat?.depository || "CDSL"} />
      </div>
      <div style={{ marginTop: 18, display: "grid", rowGap: 12 }}>
        <LinkArrow>Pay AMC upfront</LinkArrow>
        <LinkArrow>Enable Demat Debit and Pledge Instruction (DDPI)</LinkArrow>
        <LinkArrow>Shareholder e-voting</LinkArrow>
      </div>
    </>
  );
}

function SegmentsPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Manage segments</h2>
      <p className="muted" style={{ maxWidth: 700, fontSize: 14, lineHeight: 1.6 }}>
        Activate or deactivate trading segments on your account. Once a segment is deactivated, it cannot be activated
        for the next 12 hours. <a className="blue" href="#">Learn more</a>.
      </p>
      <Tabs tabs={["Kill switch", "Activate segment"]} leftPad={0} />
      <div style={{ marginTop: 10, display: "grid", rowGap: 12, maxWidth: 520 }}>
        <SegmentRow label="NSE - Equity" on />
        <SegmentRow label="BSE - Equity" on />
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn">Continue</button>
      </div>
      <div style={{ marginTop: 26 }}>
        <Disclosure title="Account closure" />
      </div>
    </>
  );
}

function MTFPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Margin Trading Facility</h2>
      <p className="muted" style={{ maxWidth: 800, fontSize: 14, lineHeight: 1.6 }}>
        Buy stocks for delivery with lesser margins using the Margin Trading Facility. <a className="blue" href="#">Read more</a>.
      </p>
      <div style={{ marginTop: 12 }}>
        <a className="blue" href="#">Terms and conditions</a>
      </div>
      <div style={{ marginTop: 18 }}>
        <button className="btn">Enable MTF</button>
      </div>
    </>
  );
}

function DocumentsPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Documents</h2>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ width: 220 }}>
          <select className="select" defaultValue="">
            <option value="" disabled>Select document</option>
            <option>Account statement</option>
            <option>Tax P&L</option>
          </select>
        </div>
        <button className="btn ghost">E-mail to me</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "flex-start" }}>
        <InfoIcon />
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Selected document will be sent to your registered e-mail.
        </p>
      </div>
    </>
  );
}

function CommodityDeclPanel() {
  const rows = [
    "Aluminium",
    "Brass",
    "Bullion Index",
    "Cardamom",
    "Castorseed",
    "Copper",
    "Cotton",
    "Cotton Candy",
    "Cotton Oil",
  ];
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Commodity declaration – Type of trader</h2>
      <p className="muted" style={{ maxWidth: 820, fontSize: 14, lineHeight: 1.6 }}>
        Please select the appropriate option for the commodities you intend to trade. (If you're a retail trader who
        doesn't fall into any of the listed categories, select "Others")
      </p>
      <div style={{ marginTop: 12, display: "grid", rowGap: 12, maxWidth: 720 }}>
        {rows.map((r) => (
          <div key={r} className="row" style={{ justifyContent: "space-between" }}>
            <div style={{ width: 200 }}>{r}</div>
            <div style={{ flex: 1 }}>
              <select className="select" defaultValue="">
                <option value="" disabled>
                  Select status/type
                </option>
                <option>Retail</option>
                <option>HNI</option>
                <option>Others</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function FamilyPanel() {
  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Family</h2>
      <p className="muted" style={{ maxWidth: 760, fontSize: 14, lineHeight: 1.6 }}>
        Link your family's Zerodha accounts as sub-accounts to view combined portfolios. <a className="blue" href="#">Learn more</a>.
      </p>
      <div style={{ marginTop: 14 }}>
        <button className="btn">Link a sub-account</button>
      </div>
      <div style={{ marginTop: 12 }}>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Family accounts not with Zerodha? <br />Transfer them to Zerodha to link them. <a className="blue" href="#">Learn more</a>.
        </p>
      </div>
    </>
  );
}

function VerifiedPLPanel({ accountData }) {
  const getDefaultIndex = (nameDisplay) => {
    if (nameDisplay === "Full name") return 0;
    if (nameDisplay === "Short name") return 1;
    if (nameDisplay === "Masked") return 2;
    return 0;
  };

  return (
    <>
      <h2 style={{ margin: "2px 0 18px", fontSize: 22, fontWeight: 400 }}>Verified P&L</h2>
      <p className="muted" style={{ maxWidth: 780, fontSize: 14, lineHeight: 1.6 }}>
        Share your P&L and trades publicly, verified by Zerodha. <a className="blue" href="#">Read more</a>.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 40, alignItems: "start" }}>
        {/* Left form */}
        <div style={{ display: "grid", rowGap: 12 }}>
          <div className="muted" style={{ fontSize: 14 }}>Personal information</div>
          <RadioRow 
            name="nameOpt" 
            options={["Full name", "Short name", "Masked"]} 
            defaultIndex={getDefaultIndex(accountData?.verifiedPL?.nameDisplay)} 
          />
          <label className="row" style={{ gap: 8, fontSize: 14 }}>
            <input 
              type="checkbox" 
              defaultChecked={accountData?.verifiedPL?.useAvatar !== false} 
            /> Use my Kite's avatar image
          </label>
          <div>
            <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>Description or profile (optional)</div>
            <textarea 
              className="input" 
              rows={4} 
              defaultValue={accountData?.verifiedPL?.description || ""} 
            />
          </div>
          <div>
            <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>Personal webpage (optional)</div>
            <input 
              className="input" 
              defaultValue={accountData?.verifiedPL?.personalWebpage || ""} 
            />
          </div>
          <div className="muted" style={{ fontSize: 14, marginTop: 8 }}>Segments to share</div>
          <div className="row" style={{ gap: 20, fontSize: 14 }}>
            <label><input type="checkbox" defaultChecked={accountData?.verifiedPL?.segments?.equity}/> Equity</label>
            <label><input type="checkbox" defaultChecked={accountData?.verifiedPL?.segments?.currency}/> Currency</label>
            <label><input type="checkbox" defaultChecked={accountData?.verifiedPL?.segments?.futuresOptions}/> Futures & Options</label>
            <label><input type="checkbox" defaultChecked={accountData?.verifiedPL?.segments?.commodity}/> Commodity</label>
          </div>
          <div>
            <button className="btn">Save</button>
          </div>
        </div>

        {/* Right card */}
        <div style={{ border: "1px solid #eceff2", borderRadius: 8, padding: 16 }}>
          <div className="row" style={{ gap: 12 }}>
            <Avatar initials="MS" />
            <div>
              <div>Mahammad Sayad</div>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>Timeline to share</div>
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div className="row" style={{ gap: 10 }}>
                <span className="muted" style={{ fontSize: 14 }}>Live P&L (updates everyday)</span>
                <Toggle on={accountData?.verifiedPL?.livePL || false} />
              </div>
            </div>
            <div style={{ marginTop: 10, maxWidth: 220 }}>
              <select 
                className="select" 
                defaultValue={accountData?.verifiedPL?.timelineDays || 30}
              >
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>2025-08-28 ~ 2025-09-28</div>
            <label className="row" style={{ gap: 8, marginTop: 8, fontSize: 14 }}>
              <input 
                type="checkbox" 
                defaultChecked={accountData?.verifiedPL?.displayTrades !== false} 
              /> Display trades
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

/* ================= Helpers / atoms ================= */

function KV({ title, value }) {
  return (
    <div className="kv">
      <div className="muted" style={{ fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 16 }}>{value}</div>
    </div>
  );
}

function Field({ label, value, editable }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
        {label} {editable && <EditIcon />}
      </div>
      <div style={{ fontSize: 16 }}>{value}</div>
    </div>
  );
}

function Tabs({ tabs, leftPad = 2 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, margin: `${leftPad}px 0 8px` }}>
      {tabs.map((t, i) => (
        <div key={t} style={{ position: "relative", paddingBottom: 8, color: i === 0 ? "#1f2328" : "#6b7280" }}>
          {t}
          {i === 0 && (
            <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "#0b5bd3" }} />
          )}
        </div>
      ))}
      <div style={{ flex: 1, height: 1, background: "#eceff2" }} />
    </div>
  );
}

function KVRow({ k, v, s }) {
  return (
    <div>
      <div className="muted" style={{ fontSize: 13 }}>{k}</div>
      {s && <div className="muted" style={{ fontSize: 12, margin: "2px 0 2px" }}>({s})</div>}
      <div style={{ fontSize: 16 }}>{v}</div>
    </div>
  );
}

function LinkArrow({ children }) {
  return (
    <a className="blue" href="#" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      {children} <ArrowRight />
    </a>
  );
}

function SegmentRow({ label, on }) {
  return (
    <div className="row" style={{ justifyContent: "space-between", borderBottom: "1px solid #f0f2f4", padding: "10px 0" }}>
      <div>{label}</div>
      <Toggle on={on} />
    </div>
  );
}

function Disclosure({ title }) {
  return (
    <div style={{ borderTop: "1px solid #eceff2", paddingTop: 12 }}>
      <div className="row" style={{ gap: 6 }}>
        <span>{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
    </div>
  );
}

function RadioRow({ name, options, defaultIndex = 0 }) {
  return (
    <div className="row" style={{ gap: 18, fontSize: 14 }}>
      {options.map((o, i) => (
        <label key={o} className="row" style={{ gap: 6 }}>
          <input type="radio" name={name} defaultChecked={i === defaultIndex} /> {o}
        </label>
      ))}
    </div>
  );
}

function Toggle({ on }) {
  return (
    <span
      aria-label="toggle"
      style={{
        display: "inline-block",
        width: 44,
        height: 24,
        background: on ? "#0b5bd3" : "#cbd5e1",
        borderRadius: 999,
        position: "relative",
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 2,
          left: on ? 24 : 2,
          width: 20,
          height: 20,
          background: "#fff",
          borderRadius: "50%",
          transition: "left .15s",
          boxShadow: "0 1px 2px rgba(0,0,0,.1)",
        }}
      />
    </span>
  );
}

function Avatar({ initials }) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "#eef0ff",
        color: "#5E63FF",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {initials}
    </div>
  );
}

function EditIcon() {
  return <span style={{ marginLeft: 8, color: "#0b5bd3", fontSize: 14, cursor: "pointer" }}>✎</span>;
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.6">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function ArrowRight(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0b5bd3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>
  )
}

function InfoIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="8"/><path d="M12 12v4"/></svg>
  )
}

function renderPanel(active, accountData){
  switch(active){
    case "Personal": return <PersonalPanel accountData={accountData}/>;
    case "Nominees": return <NomineesPanel/>;
    case "Bank": return <BankPanel/>;
    case "Demat": return <DematPanel accountData={accountData}/>;
    case "Segments": return <SegmentsPanel/>;
    case "Margin Trading Facility (MTF)": return <MTFPanel/>;
    case "Documents": return <DocumentsPanel/>;
    case "Commodity declaration": return <CommodityDeclPanel/>;
    case "Family": return <FamilyPanel/>;
    case "Verified P&L": return <VerifiedPLPanel accountData={accountData}/>;
    default: return null;
  }
}
