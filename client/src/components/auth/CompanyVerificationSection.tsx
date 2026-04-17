import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyCompany } from "../../services/authService";
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
      <div className="auth-hero glass">
        <img src="/assets/images/company-hero.png" alt="Company Verification" />
        <h1>Company Registration and Verification</h1>
        <p>Companies use a verification flow before accessing the company portal and compliance dashboard.</p>
      </div>

      <form className="auth-card glass" onSubmit={handleSubmit}>
        <h3>Verify Your Company</h3>

        <p>Fill out the form below using your company&apos;s official details. After verification submission, you will continue to the company login page.</p>

        <input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Official Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input type="file" accept="application/pdf" />

        {error && <p className="switch" style={{ color: "#c62828" }}>{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Submitting..." : "Submit Company Verification"}
        </button>

        <small>By submitting, you confirm the information is correct.</small>
      </form>

      <div className="help-card glass">
        <h3>Need Help?</h3>
        <p>Our support team is here if you have any questions.</p>
        <button type="button" className="btn-primary">Contact Support</button>
      </div>
      </section>
    </main>
  );
}