// AccountPage.jsx — pixel-faithful clone of the screenshot (clean lines, no cards)
import React from "react";

export default function AccountPage() {
  const font =
    "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

  return (
    <div style={{ fontFamily: font, color: "#1f2328", background: "#fff", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "28px 24px 80px" }}>
        {/* Page title */}
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: 0.2 }}>Account</h1>

        {/* Top summary row (single hairline underneath) */}
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
          {/* Avatar + Name block (matches left stack) */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "#eef0ff",
                color: "#5E63FF",
                fontWeight: 800,
                fontSize: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-label="Avatar"
            >
              MS
            </div>
          </div>

          {/* Name */}
          <KV title="Name" value="Mahammad Sayad" />

          {/* Client / Support */}
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: 10 }}>
            <div style={kKey}>Client ID</div>
            <div style={kVal}>FJP018</div>

            <div style={kKey}>Support code</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ ...kVal, letterSpacing: 2 }}>••••</span>
              <a style={blueLink}>View</a>
            </div>
          </div>

          {/* CKYC */}
          <KV title="CKYC no." value="300238795666432" />
        </div>

        {/* Body layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "310px 1fr",
            columnGap: 40,
            paddingTop: 24,
          }}
        >
          {/* Sidebar (plain list with active row light fill) */}
          <nav
            aria-label="Sections"
            style={{
              borderRight: "1px solid #eceff2",
              paddingRight: 24,
            }}
          >
            {sidebarItems.map((label, i) => {
              const active = i === 0;
              return (
                <div
                  key={label}
                  style={{
                    padding: "14px 16px",
                    marginBottom: 4,
                    borderRadius: 8,
                    background: active ? "#f6f8fb" : "transparent",
                    color: active ? "#0b5bd3" : "#1f2328",
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                  }}
                >
                  {label}
                </div>
              );
            })}
          </nav>

          {/* Main panel */}
          <section>
            <h2
              style={{
                margin: "2px 0 20px",
                fontSize: 24,
                fontWeight: 800,
              }}
            >
              Personal
            </h2>

            {/* Two-column info grid like screenshot */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: 80,
                rowGap: 26,
              }}
            >
              {/* Email */}
              <div>
                <div style={fieldLabel}>
                  E-mail <Edit />
                </div>
                <div style={fieldValue}>SAHADSAAD186@GMAIL.COM</div>
              </div>

              {/* Mobile */}
              <div>
                <div style={fieldLabel}>
                  Mobile <Edit />
                </div>
                <div style={fieldValue}>*6950</div>
              </div>

              {/* PAN (single on left column, right column empty to keep spacing) */}
              <div>
                <div style={fieldLabel}>PAN</div>
                <div style={fieldValue}>*182M</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* =============== Atoms & Helpers =============== */

function KV({ title, value }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", rowGap: 10 }}>
      <div style={kKey}>{title}</div>
      <div style={kVal}>{value}</div>
    </div>
  );
}

function Edit() {
  return (
    <span
      role="img"
      aria-label="edit"
      style={{ marginLeft: 8, color: "#0b5bd3", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
    >
      ✎
    </span>
  );
}

const sidebarItems = [
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
];

const kKey = { color: "#6b7280", fontSize: 14 };
const kVal = { color: "#1f2328", fontSize: 16, fontWeight: 600 };

const blueLink = {
  color: "#0b5bd3",
  fontSize: 13,
  fontWeight: 700,
  textDecoration: "none",
  cursor: "pointer",
};

const fieldLabel = { color: "#6b7280", fontSize: 14, marginBottom: 6 };
const fieldValue = { fontSize: 16, fontWeight: 600, letterSpacing: 0.2 };
