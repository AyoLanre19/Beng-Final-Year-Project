import { useState } from "react";
import PublicNavbar from "../layout/PublicNavbar";
import "../../styles/pricing.css";


export default function PricingSection() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="pricing-wrapper">
        <PublicNavbar />
      <h2>Plans for Individuals & Businesses</h2>
      <p className="pricing-subtitle">
        Choose the plan that fits your needs and optimize your tax and expense
        management with AI-powered solutions.
      </p>

      {/* Billing Toggle */}
      <div className="billing-toggle glass">
        <span className={billing === "monthly" ? "active" : ""}>Monthly</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={billing === "yearly"}
            onChange={() =>
              setBilling(billing === "monthly" ? "yearly" : "monthly")
            }
          />
          <span className="slider" />
        </label>
        <span className={billing === "yearly" ? "active" : ""}>
          Yearly <small>Save 20%</small>
        </span>
      </div>

      {/* Cards */}
      <div className="pricing-grid">
        {/* FREE */}
        <div className="pricing-card glass">
          <img src="/assets/images/pricing-free.png" alt="Free Plan" />
          <h3>Free</h3>
          <p className="price">₦0<span>/month</span></p>

          <ul>
            <li>✔ Personal Expense Tracking</li>
            <li>✔ Basic Tax Deductions</li>
            <li>✔ AI Tax Tips</li>
          </ul>

          <button className="btn-primary">Get Started</button>
        </div>

        {/* GOLD */}
        <div className="pricing-card gold glass">
          <img
            src="/assets/images/badge-popular.png"
            className="badge"
            alt="Most Popular"
          />

          <img src="/assets/images/pricing-gold.png" alt="Gold Plan" />
          <h3>Gold</h3>
          <p className="price gold-text">
            ₦25,000<span>/month</span>
          </p>
          <p className="approx">($25/month approx.)</p>

          <ul>
            <li>✔ Advanced Expense Management</li>
            <li>✔ Maximize Business Deductions</li>
            <li>✔ Tax Optimization Reports</li>
          </ul>

          <button className="btn-gold">Get Started</button>
        </div>

        {/* PREMIUM */}
        <div className="pricing-card glass">
          <img src="/assets/images/pricing-premium.png" alt="Premium Plan" />
          <h3>Premium</h3>
          <p className="price">Custom</p>
          <p className="approx">Starting at 100+ Employees</p>

          <ul>
            <li>✔ Custom Solutions & Support</li>
            <li>✔ Dedicated Account Manager</li>
            <li>✔ Enterprise Compliance</li>
          </ul>

         <button
  className="btn-outline"
  onClick={() => window.location.href = "/pricing/company"}
>
  Contact Sales
</button>
        </div>
      </div>

      {/* Trust & Security */}
      <div className="pricing-footer">
        <div className="secure">
          <img src="/assets/images/secure-icon.png" alt="Secure" />
          <span>Your Data is Secure (Learn More)</span>
        </div>

        <p>Trusted by Individuals, Small Businesses & Leading Companies</p>

        <div className="brands">
           <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}