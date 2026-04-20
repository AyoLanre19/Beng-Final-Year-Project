import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { verifyCompany } from "../../services/authService";
import companyHero from "../../assets/images/companyportals.jpg";
import "../../styles/auth.css";

export default function CompanyVerificationSection() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cacNumber, setCacNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await verifyCompany({
        companyName,
        email,
        password,
        cacNumber,
        phone: phoneNumber,
      });

      localStorage.setItem("portalType", "company");
      localStorage.setItem("companyVerified", "true");
      navigate("/company/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit company verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <form className="auth-card auth-surface auth-flow-card" onSubmit={handleSubmit}>
          <div className="auth-hero">
            <img src={companyHero} alt="Company verification" />
            <span className="auth-chip">Company Portal</span>
            <h1>Company Registration and Verification</h1>
            <p>Submit your company details once. After review, you can continue into the company portal and compliance dashboard.</p>
          </div>

          <div className="auth-copy">
            <h2>Company details</h2>
            <p>Use your company&apos;s official information so verification is quick and accurate.</p>
          </div>

          <div className="auth-fields">
            <input
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
              required
            />
            <input
              type="email"
              placeholder="Official Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <input
              placeholder="CAC Registration Number"
              value={cacNumber}
              onChange={(e) => setCacNumber(e.target.value)}
              required
            />
            <input
              placeholder="+234 Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <input type="file" accept="application/pdf" />
          </div>

          {error && <p className="auth-alert">{error}</p>}

          <button type="submit" className="auth-primary-button" disabled={loading}>
            {loading ? "Submitting verification..." : "Submit Company Verification"}
          </button>

          <small className="auth-helper">We&apos;ll take you to the company login page after submission.</small>

          <div className="auth-card-footer">
            <span>Already verified?</span>
            <Link to="/company/login">Login</Link>
          </div>
        </form>

        <div className="auth-help-card auth-surface">
          <h3>Need Help?</h3>
          <p>Our support team is here if you have any questions.</p>
          <button type="button" className="auth-primary-button">Contact Support</button>
        </div>
      </section>
    </main>
  );
}
