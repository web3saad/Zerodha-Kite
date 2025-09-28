import React from "react";

// Mobile Login Screen (Kite-style)
// Notes:
// - Designed for 360–430px wide mobile view. Centered with generous white space.
// - Uses Tailwind utility classes. If Tailwind isn’t available, swap className values for your CSS.
// - Includes inline <style> to load the Inter font and a few fine-tuned rules.
// - All icons/logos are hand-drawn SVGs to avoid external assets.

export default function KiteLoginMobile() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-4">
      {/* Font + fine-tune styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        :root { --brand: #ff5722; --brand2: #ff5a1f; }
        .font-inter { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif; }
        .input { outline: none; }
        .input::placeholder { color: #b8b8b8; }
      `}</style>

      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 pt-10 pb-2 text-center font-inter">
            {/* Top brand mark */}
            <img src="/logo.png" alt="Kite logo" className="mx-auto mb-6 w-12 h-12 object-contain" />

            <h1 className="text-3xl font-normal tracking-tight text-gray-800 mb-7">
              Login to Kite
            </h1>

            {/* Username */}
            <div className="mb-4">
              <label className="sr-only">Phone or User ID</label>
              <div className="border rounded-md border-gray-200 focus-within:border-gray-300">
                <input
                  type="text"
                  className="input w-full px-4 py-3 text-[18px] placeholder-gray-400"
                  placeholder="Phone or User ID"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="sr-only">Password</label>
              <div className="border rounded-md border-gray-200 flex items-center focus-within:border-gray-300">
                <input
                  type="password"
                  className="input flex-1 px-4 py-3 text-[18px] placeholder-gray-400"
                  placeholder="Password"
                />
                <button aria-label="Show password" className="px-3 py-3">
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Login button */}
            <button className="w-full py-3.5 rounded-md text-white text-[20px] font-medium bg-[#ff5a1f] hover:opacity-95 transition">
              Login
            </button>

            {/* Forgot link */}
            <div className="mt-5 mb-4 text-[15px] text-gray-500">
              Forgot user ID or password?
            </div>
          </div>

          {/* Divider area for store icons */}
          <div className="px-6 pb-6 pt-2 text-center font-inter">
            <div className="flex items-center justify-center gap-8 mb-5">
              <img src="/playstore.png" alt="Google Play" className="w-6 h-6 object-contain"/>
              <img src="/appstore.png" alt="App Store" className="w-6 h-6 object-contain"/>
            </div>

            {/* Zerodha wordmark */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <ZIcon className="w-5 h-5 text-gray-400" />
              <span className="tracking-wider text-gray-500 font-semibold">ZERODHA</span>
            </div>

            <div className="text-[18px] text-gray-700 mb-3">Don't have an account? Signup now!</div>

            {/* Legal lines */}
            <p className="text-[12px] leading-5 text-gray-500">
              Zerodha Broking Limited: Member of <u>NSE</u>, <u>BSE</u> - SEBI Reg. no. INZ000031633, <u>CDSL</u> - SEBI Reg. no. IN-DP-431-2019<br/>
              <u>Smart Online Dispute Resolution</u> | <u>SEBI SCORES</u>
            </p>

            <div className="text-[12px] text-gray-400 mt-5">v3.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SVGs ---
function KiteGlyph() {
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Simple kite-like diamond with cut */}
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6a2b" />
          <stop offset="100%" stopColor="#ff3f16" />
        </linearGradient>
      </defs>
      <polygon points="50,8 86,44 50,44 14,44" fill="url(#g)" transform="translate(0,14)"/>
      <polygon points="50,8 86,44 50,44 14,44" fill="#fff" transform="translate(0,14) scale(0.6) translate(33,0)" />
    </svg>
  );
}

function EyeIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PlayBadge({ className = "" }) {
  return (
    <svg viewBox="0 0 48 48" className={className}>
      <path d="M24 0a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z" fill="#26a69a" opacity=".15"/>
      <polygon points="18,14 36,24 18,34" fill="#26a69a" />
    </svg>
  );
}

function AppleLogo({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M16.365 13.694c.037 3.97 3.478 5.292 3.517 5.309-.03.097-.55 1.888-1.815 3.74-1.094 1.59-2.234 3.178-4.04 3.214-1.77.033-2.338-1.04-4.36-1.04-2.022 0-2.66 1.006-4.34 1.074-1.743.067-3.07-1.72-4.17-3.304-2.27-3.293-4.01-9.306-1.686-13.367 1.16-2.025 3.236-3.313 5.493-3.347 1.716-.033 3.336 1.164 4.36 1.164 1.023 0 3.01-1.44 5.08-1.227.866.036 3.304.35 4.87 2.636-.127.08-2.91 1.7-2.89 5.148z"/>
      <path d="M14.07 3.796c.94-1.137 1.58-2.72 1.406-4.296-1.36.054-2.998.905-3.968 2.04-.872 1.028-1.63 2.664-1.429 4.223 1.508.117 3.05-.77 3.99-1.967z"/>
    </svg>
  );
}

function ZIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M4 6h16v3H10l10 9v3H4v-3h10L4 9V6z" />
    </svg>
  );
}
