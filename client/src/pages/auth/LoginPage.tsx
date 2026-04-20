import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { clearStoredUser, type UserType } from "../../services/authService";
import { clearStoredToken } from "../../services/apiClient";
import PublicNavbar from "../../components/layout/PublicNavbar";
import loginpic from "../../assets/images/loginpic.jpg";
import "../../styles/login.css";

interface LoginPageProps {
  forcedPortal?: UserType;
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="m5.5 7.5 6.5 5 6.5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10V8a4 4 0 1 1 8 0v2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage({ forcedPortal }: LoginPageProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedPortal = forcedPortal ?? null;

  const portalHeading = selectedPortal === "individual"
    ? "Login to Your Individual Portal"
    : selectedPortal === "sme"
      ? "Login to Your SME Portal"
      : selectedPortal === "company"
        ? "Login to Your Company Portal"
        : "Login to Your Account";

  const portalDescription = selectedPortal === "individual"
    ? "Access your personal tax dashboard, income records, and filing tools."
    : selectedPortal === "sme"
      ? "Access your SME workspace for revenue, expenses, and business filing tasks."
      : selectedPortal === "company"
        ? "Access your company compliance dashboard and enterprise tax workflow."
        : "Access your intelligent tax and expense management dashboard.";

  const signupHref = selectedPortal === "company"
    ? "/company/signup"
    : selectedPortal
      ? `/${selectedPortal}/signup`
      : "/get-started";

  const signupLabel = selectedPortal === "company"
    ? "Start company verification"
    : selectedPortal === "sme"
      ? "Create SME account"
      : selectedPortal === "individual"
        ? "Create individual account"
        : "Sign Up";

  if (selectedPortal) {
    localStorage.setItem("portalType", selectedPortal);
  }

  const redirectToDashboard = (portal: string) => {
    if (portal === "individual") navigate("/individual/dashboard");
    else if (portal === "sme") navigate("/sme/dashboard");
    else if (portal === "company") navigate("/company/dashboard");
    else navigate("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password });
      const userType = response.data.user.userType;

      if (selectedPortal && userType !== selectedPortal) {
        clearStoredToken();
        clearStoredUser();
        localStorage.removeItem("portalType");
        setError(`This account belongs to the ${userType.toUpperCase()} portal. Use the ${userType.toUpperCase()} login page.`);
        return;
      }

      localStorage.setItem("portalType", userType);
      redirectToDashboard(userType);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login right now.");
    } finally {
      setLoading(false);
    }
  };

  const portalChip = selectedPortal === "company"
    ? "Company Portal"
    : selectedPortal === "sme"
      ? "SME Portal"
      : selectedPortal === "individual"
        ? "Individual Portal"
        : "Secure Login";

  return (
    <>
      <PublicNavbar />

      <main className="login-page">
        <section className="login-wrapper">
          <article className="login-card">
            <header className="login-hero">
              <img src={loginpic} alt="Secure login" />
              <span className="login-chip">{portalChip}</span>
              <h1 className="login-title">{portalHeading}</h1>
              <p className="login-sub">{portalDescription}</p>
              <p className="login-note">Use your email and password below for the fastest sign-in.</p>
            </header>

            <form onSubmit={handleLogin} className="login-form">
              <label className="login-input-row">
                <span className="input-icon" aria-hidden="true">
                  <EmailIcon />
                </span>

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </label>

              <label className="login-input-row">
                <span className="input-icon" aria-hidden="true">
                  <LockIcon />
                </span>

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>

              {error && <p className="login-alert">{error}</p>}

              <button type="submit" className="login-primary-button" disabled={loading}>
                {loading ? "Logging you in..." : "Login"}
              </button>
            </form>

            <div className="login-card-footer">
              <span>Don&apos;t have an account?</span>
              <Link to={signupHref}>{signupLabel}</Link>
            </div>

            <p className="login-demo">
              Demo login: `individual@example.com` / `Password123!`
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
