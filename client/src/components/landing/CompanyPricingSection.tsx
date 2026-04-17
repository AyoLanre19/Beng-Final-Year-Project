import "../../styles/company-pricing.css";

export default function CompanyPricingSection() {
  return (
    <section className="company-pricing-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        ← Home &nbsp;›&nbsp; Pricing &nbsp;›&nbsp; Enterprise Pricing
      </div>

      {/* Header */}
      <h2>Pricing For Companies</h2>
      <p className="subtitle">
        Get tailored solutions for your company's tax and compliance needs.
      </p>

      {/* Pricing Cards */}
      <div className="pricing-grid">
        {/* SILVER */}
        <div className="pricing-card glass">
          <img src="/assets/images/company-silver.png" alt="Silver Plan" />

          <h3>Silver</h3>
          <p className="price">₦100K<span>/month</span></p>
          <p className="note">Starting at 100+ Employees</p>

          <ul>
            <li>✔ Real-Time Deduction Tracking</li>
            <li>✔ Compliance Monitoring</li>
            <li>✔ Tax Risk Assessment</li>
            <li>✔ Advanced Reporting</li>
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

          <img src="/assets/images/company-gold.png" alt="Gold Plan" />

          <h3>Gold</h3>
          <p className="price gold-text">₦200K<span>/month</span></p>
          <p className="note">(Starting at 100+ Employees)</p>

          <ul>
            <li>✔ All Silver Features</li>
            <li>✔ Forecasting & Tax Strategy</li>
            <li>✔ Priority Support</li>
            <li>✔ Dedicated Account Manager</li>
          </ul>

          <button className="btn-gold">Get Started</button>
        </div>

        {/* CUSTOM */}
        <div className="pricing-card glass">
          <img src="/assets/images/company-custom.png" alt="Custom Plan" />

          <h3>Custom</h3>
          <p className="price">Custom Pricing</p>
          <p className="note">Starting at 100+ Employees</p>

          <ul>
            <li>✔ Enterprise-Level Solutions & APIs</li>
            <li>✔ Personalized Engagement Plans</li>
            <li>✔ Compliance & Security Audits</li>
          </ul>

          <button className="btn-outline">Contact Sales</button>
        </div>
      </div>

      {/* Footer */}
      <div className="pricing-footer">
        <div className="secure">
          <img src="/assets/images/secure-icon.png" alt="Secure" />
          <span>Security focused on Corporates & Enterprises</span>
        </div>

        <p>Trusted by Individuals, Small Businesses & Leading Companies</p>

        <div className="brands">
          <img src="/assets/images/zenith.png" />
          <img src="/assets/images/mtn.png" />
          <img src="/assets/images/dangote.png" />
          <img src="/assets/images/oando.png" />
        </div>
      </div>
    </section>
  );
}