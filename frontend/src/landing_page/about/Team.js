import React from "react";
import { Link } from "react-router-dom";

function Team() {
  return (
    <div className="container">
      <div className="row p-5 mt-5">
        <h1 className="text-center text-muted">People</h1>
      </div>
      <div className="row p-5 text-muted" style={{ fontSize: "1.2em" }}>
        <div className="col-6 p-5 text-center">
          <img src="media/images/nithinKamath.jpg" className="rounded-circle" style={{ width: "50%" }} />
          <h4 className="mt-5">Nithin Kamath</h4>
          <h6>Founder, CEO</h6>
        </div>
        <div className="col-6 p-5" style={{ fontSize: "1em" }}>
          <p>Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.</p>
          <p>He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).</p>
          <p>Playing basketball is his zen.</p>
          <p>
            Connect on{" "}
            <Link to="/" style={{ textDecoration: "none", color: "#387ed1" }}>
              Homepage
            </Link>{" "}
            /{" "}
            <a href="https://tradingqna.com/u/nithin/summary" style={{ textDecoration: "none", color: "#387ed1" }}>
              TradingQnA
            </a>{" "}
            /{" "}
            <a href="https://twitter.com/Nithin0dha" style={{ textDecoration: "none", color: "#387ed1" }}>
              Twitter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Team;
