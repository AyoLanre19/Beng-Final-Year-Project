import PublicNavbar from "../../components/layout/PublicNavbar";
import heroImage from "../../assets/images/hero-dashboard.png-removebg-preview.png";
import aiIcon from"../../assets/images/Ai_driven_icon-removebg-preview.png";
import boost from"../../assets/images/boost_your_savings-removebg-preview.png";
import secure from"../../assets/images/Secure___Confidential-removebg-preview.png";


import "../../styles/landing.css";

import FeaturesSection from "../../components/landing//FeaturesSection";
import PricingSection from "../../components/landing/PricingSection";

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <PublicNavbar />

      {/* HERO */}
      <section className="hero glass">
        <div className="hero-left">
          <h1>
            Smart Tax & Expense<br />Optimization Made Easy.
          </h1>

          <p className="subtitle">
            Maximize your refunds, minimize your headaches.<br />
            AI-powered solutions for individuals, SMEs, and enterprises.
          </p>
          
          <div className="features2">
          <div className="features">
            <div className="feature">
              <img src={secure} alt="Secure" />
              <span>Secure & Confidential</span>
            </div>

            <div className="feature">
              <img src={aiIcon} alt="AI" />
              <span>AI-Driven Insights</span>
            </div>

            <div className="feature">
              <img src={boost} alt="Savings" />
              <span>Boost Your Savings</span>
            </div>
          </div>
          </div>
          
          <button className="btn-primary">Get Started</button>
        </div>

        <div className="hero-right">
                          <img
                  src={heroImage}
                  alt="Dashboard Preview"
                  className="hero-image"
                />
        </div>
      </section>

      {/* TRUSTED BRANDS */}
      <section className="trusted">
        <p>Trusted by Individuals, Small Businesses & Leading Companies</p>

        <div className="brands">
          <img src="/assets/images/zenith.png" alt="Zenith Bank" />
          <img src="/assets/images/mtn.png" alt="MTN" />
          <img src="/assets/images/dangote.png" alt="Dangote" />
          <img src="/assets/images/oando.png" alt="Oando" />
        </div>
      </section>

     
    </div>
  );
}