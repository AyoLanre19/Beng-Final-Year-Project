import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, signupUser, type UserType } from "../../services/authService";
import individualHero from "../../assets/images/individualportal.jpg";
import smeHero from "../../assets/images/smeportal.jpg";
import "../../styles/auth.css";

interface IndividualSignupSectionProps {
  forcedPortal?: Extract<UserType, "individual" | "sme">;
}

export default function IndividualSignupSection({ forcedPortal }: IndividualSignupSectionProps) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const portal: "individual" | "sme" = forcedPortal ?? "individual";
  const heroImage = portal === "sme" ? smeHero : individualHero;

  const heading = portal === "sme" ? "Create Your SME Account" : "Create Your Individual Account";
  const description = portal === "sme"
    ? "Set up your SME portal to manage business revenue, expenses, and filing."
    : "Set up your individual portal to manage income, deductions, and tax filing.";

  const redirectToDashboard = (userType: "individual" | "sme") => {
    if (userType === "sme") {
      navigate("/sme/dashboard");
      return;
    }

    navigate("/individual/dashboard");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      localStorage.setItem("portalType", portal);

      const response = await signupUser({
        fullName,
        email,
        password,
        userType: portal,
      });

      const loginResponse = await loginUser({ email, password });
      localStorage.setItem("portalType", response.data.user.userType);
      redirectToDashboard(loginResponse.data.user.userType as "individual" | "sme");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <form className="auth-card auth-surface auth-flow-card" onSubmit={handleSignup}>
          <div className="auth-hero">
            <img src={heroImage} alt={portal === "sme" ? "SME signup" : "Individual signup"} />
            <span className="auth-chip">{portal === "sme" ? "SME Portal" : "Individual Portal"}</span>
            <h1>{heading}</h1>
            <p>{description}</p>
          </div>

          <div className="auth-copy">
            <h2>{portal === "sme" ? "Business details" : "Personal details"}</h2>
            <p>Use your email and password below. We&apos;ll sign you in immediately after your account is created.</p>
          </div>

          <div className="auth-fields">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {error && <p className="auth-alert">{error}</p>}

          <button type="submit" className="auth-primary-button" disabled={loading}>
            {loading ? "Creating your account..." : "Create Account"}
          </button>

          <p className="auth-helper">Takes less than a minute. You&apos;ll go straight to your dashboard.</p>

          <div className="auth-card-footer">
            <span>Already have an account?</span>
            <Link to={`/${portal}/login`}>Login</Link>
          </div>
        </form>
      </section>
    </main>
  );
}
