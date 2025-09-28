import * as React from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [err, setErr] = React.useState("");

  React.useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const form = new FormData(e.currentTarget);
    const data = {
      // backend expects email+password; we map the first field to email
      email: form.get("email"),
      password: form.get("password"),
    };
    try {
      const res = await axios.post(
        "https://zerodha-clone-backend-8nlf.onrender.com/user/login",
        data,
        { headers: { "Content-Type": "application/json" } }
      );
      await login(res.data.token);
    } catch (error) {
      if (error?.response?.data?.error) setErr(error.response.data.error);
      else if (error?.request) setErr("Network Error");
      else setErr("Something went wrong");
    }
  };

  return (
    <div className="kite-login">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap');
        :root {
          --text:#2f3337;
          --muted:#8a9097;
          --line:#eceff2;
          --input:#e8eaed;
          --orange:#ff6a3d;
        }
        * { box-sizing: border-box; }
        body { margin:0; }
        .kite-login {
          min-height: 100vh;
          background: #fafbfc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding-top: 56px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
          color: var(--text);
          font-weight: 400;
        }
        .card {
          width: 500px;
          max-width: 92vw;
          background: #fff;
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 26px 28px 24px;
          box-shadow: 0 1px 2px rgba(0,0,0,.03);
        }
        .logo {
          display:block;
          margin: 8px auto 10px;
          width: 56px; height: 40px;
          object-fit: contain;
        }
        .title {
          margin: 4px 0 18px;
          text-align: center;
          font-size: 22px;
          line-height: 1.2;
          font-weight: 400; /* not bold */
        }
        .field { margin-bottom: 14px; }
        .label {
          font-size: 12px; color: #9aa1a8; margin: 0 0 6px;
        }
        .input {
          width: 100%;
          height: 44px;
          border: 1px solid var(--input);
          border-radius: 3px;
          padding: 0 12px;
          font-size: 14px;
          color: var(--text);
          outline: none;
          background: #fff;
        }
        .input:focus { border-color: #cfd6dc; }
        .pwd-wrap { position: relative; }
        .eye {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          width:18px; height:18px; opacity:.55; cursor:pointer;
        }
        .btn {
          width: 100%;
          height: 44px;
          border: none;
          border-radius: 3px;
          background: var(--orange);
          color: #fff;
          font-size: 15px;
          cursor: pointer;
        }
        .btn:active { transform: translateY(0.5px); }
        .hint {
          text-align: center; color: var(--muted);
          font-size: 13px; margin-top: 12px;
        }
        .err {
          background: #fdecea; color: #b71c1c;
          border: 1px solid #f5c6cb;
          padding: 8px 10px; border-radius: 3px;
          font-size: 13px; margin-bottom: 10px;
        }

        .stores {
          display:flex; align-items:center; justify-content:center; gap:20px;
          margin: 26px 0 8px;
        }
        .stores img { height: 24px; width:auto; display:block; }
        .wordmark { text-align:center; color:#b7bdc3; letter-spacing:2px; margin: 6px 0 18px; font-size: 13px; }
        .signup {
          text-align:center; color:#6f7680; font-size:13.5px; margin-bottom: 12px;
        }
        .signup a { color:#2f6bd7; text-decoration:none; }
        .legal { 
          width: 92vw; max-width: 840px; 
          color:#9aa1a8; font-size:12px; text-align:center; line-height:1.6;
        }
        .legal a { color:#2f6bd7; text-decoration:none; }
        .version { color:#b8bfc6; margin-top:8px; font-size:12px; }
      `}</style>

      {/* Card */}
      <form className="card" onSubmit={onSubmit}>
        {/* top logo */}
        <img
          className="logo"
          src="/logo.png"
          alt="Kite"
          onError={(e) => {
            // simple fallback vector if /logo.png not present
            e.currentTarget.outerHTML =
              `<svg width="56" height="40" viewBox="0 0 56 40" xmlns="http://www.w3.org/2000/svg">
                 <path d="M6 20 22 6h12L18 20l16 14H22L6 20z" fill="#ff6a3d"/>
                 <path d="M28 6h12L24 20l16 14H28L12 20 28 6z" fill="#d93f2e"/>
               </svg>`;
          }}
        />
        <div className="title">Login to Kite</div>

        {err ? <div className="err">{err}</div> : null}

        <div className="field">
          <div className="label">Phone number or User ID</div>
          <input className="input" type="text" name="email" autoComplete="username" />
        </div>

        <div className="field pwd-wrap">
          <div className="label">Password</div>
          <input className="input" type="password" name="password" id="kite-password" autoComplete="current-password" />
          <svg className="eye" viewBox="0 0 24 24" fill="none"
               onMouseDown={() => { const i=document.getElementById("kite-password"); i.type="text";}}
               onMouseUp={() => { const i=document.getElementById("kite-password"); i.type="password";}}
               onMouseLeave={() => { const i=document.getElementById("kite-password"); i.type="password";}}>
            <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12Z" stroke="#8a9097" strokeWidth="1.6"/>
            <circle cx="12" cy="12" r="3" stroke="#8a9097" strokeWidth="1.6"/>
          </svg>
        </div>

        <button className="btn" type="submit">Login</button>
        <div className="hint">
          <Link to="/forgot" style={{ color: "#6f7680", textDecoration: "none" }}>
            Forgot user ID or password?
          </Link>
        </div>
      </form>

      {/* App stores */}
      <div className="stores" aria-hidden>
        <img src="/playstore.png" alt="Google Play"
             onError={(e)=>{
               e.currentTarget.outerHTML = `<svg height="24" viewBox="0 0 512 512">
                 <path fill="#34a853" d="M325 256 60 492c-7-6-12-15-12-25V45c0-10 5-19 12-25l265 236z"/>
                 <path fill="#ea4335" d="M452 147c10 6 16 16 16 28v162c0 12-6 22-16 28L325 256 452 147z"/>
                 <path fill="#4285f4" d="M60 20c5-4 12-6 18-6 6 0 12 2 18 6l214 190-35 31L60 20z"/>
                 <path fill="#fbbc04" d="M96 498c-6 4-12 6-18 6-6 0-12-2-18-6l215-191 34 31L96 498z"/>
               </svg>`;
             }}/>
        <img src="/appstore.png" alt="App Store"
             onError={(e)=>{
               e.currentTarget.outerHTML = `<svg height="24" viewBox="0 0 512 512">
                 <path fill="#000" d="M349 50c-24 1-53 17-70 38-15 19-28 47-23 74 27 2 55-15 71-36 15-19 26-47 22-76zM431 352c-5 11-11 22-20 33-12 15-28 34-49 35-21 1-27-13-51-13-23 0-30 13-51 14-21 1-38-19-50-34-27-34-48-97-20-140 13-20 35-33 60-34 23 0 37 13 56 13 19 0 30-13 56-13 24 0 49 13 63 34-1 1-42 24-42 71 0 57 50 77 48 78z"/>
               </svg>`;
             }}/>
      </div>

      <div className="wordmark">ZERODHA</div>

      <div className="signup">
        Don&apos;t have an account? <Link to="/register">Signup now!</Link>
      </div>

      {/* Legal footer */}
      <div className="legal">
        Zerodha Broking Limited: Member of
        &nbsp;<a>NSE</a>, <a>BSE</a> - SEBI Reg. no. INZ000031633,
        <a> CDSL</a> - SEBI Reg. no. IN-DP-431-2019 |
        &nbsp;<a>Smart Online Dispute Resolution</a> |
        &nbsp;<a>SEBI SCORES</a>
        <div className="version">v3.0.0</div>
      </div>
    </div>
  );
}
