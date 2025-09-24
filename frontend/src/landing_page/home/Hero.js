import React from "react";

function Hero() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* LEFT: text + CTAs */}
        <div className="col-lg-5 order-2 order-lg-1">
          {/* Small kite accent could be an image if you have one; optional */}
          {/* <img src="media/images/kite-accent.svg" alt="" className="mb-3" style={{height: 32}} /> */}

          <h1 className="mb-3">Kite by Zerodha</h1>

          <p className="text-muted mb-4" style={{ maxWidth: 520 }}>
            Kite is a sleek investment and trading platform built for modern
            times and sensibilities. Ground breaking innovations presented with
            excellent usability, investing in the stock markets has never been
            this easy. Really.
          </p>

          <div className="d-flex align-items-center mb-4">
            <button className="btn btn-primary px-4 py-2">Login to Kite</button>
            <a
              href="#"
              className="ms-3 text-decoration-none"
              style={{ fontWeight: 500 }}
            >
              Try demo &rarr;
            </a>
          </div>

          {/* Store badges (use your actual asset paths) */}
          <div className="d-flex gap-3">
            <img
              src="media/images/googleplay.svg"
              alt="Get it on Google Play"
              style={{ height: 40 }}
            />
            <img
              src="media/images/appstore.svg"
              alt="Download on the App Store"
              style={{ height: 40 }}
            />
          </div>
        </div>

        {/* RIGHT: product screenshot */}
        <div className="col-lg-7 text-center order-1 order-lg-2 mb-5 mb-lg-0">
          <img
            src="media/images/hero.png"
            alt="Kite dashboard"
            style={{
              width: "100%",
              height: "auto",
              maxWidth: 900,
              borderRadius: 6,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Hero;
