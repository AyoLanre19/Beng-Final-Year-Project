import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { clearStoredUser, type UserType } from "../../services/authService";
import { clearStoredToken } from "../../services/apiClient";
import PublicNavbar from "../../components/layout/PublicNavbar";
import loginpic from "../../assets/images/loginpic.jpg";
import "../../styles/login.css";

interface LoginPageProps {
  forcedPortal?: UserType;
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

  const handleGoogle = () => {
    setError("Google sign-in is not connected yet. Use email and password for now.");
  };

  return (
    <>
      <PublicNavbar />

      <main className="login-page">
        <div className="login-wrapper">
          <header className="login-hero">
            <img src={loginpic} alt="Secure login" />
          </header>

          <section className="login-center">
            <article className="login-card">
              <h1 className="login-title">{portalHeading}</h1>

              <p className="login-sub">
                {portalDescription}
              </p>

              <button type="button" className="btn-google" onClick={handleGoogle}>
                <img src="/assets/images/google-icon.png" className="icon" alt="Google icon" />
                <span>Sign in with Google</span>
              </button>

              <div className="divider">or</div>

              <form onSubmit={handleLogin} className="login-form">
                <label className="input-row">
                  <img src="/assets/images/icon-email.png" className="input-icon" alt="Email icon" />

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>

                <label className="input-row">
                  <img src="/assets/images/icon-lock.png" className="input-icon" alt="Lock icon" />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </label>

                {error && <p className="login-sub" style={{ color: "#c62828" }}>{error}</p>}

                <div className="login-actions">
                  <a href="/forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>

              <p className="signup-line">
                Don’t have an account?
                <a href={signupHref}> {signupLabel}</a>
              </p>

              <p className="signup-line">
                Demo login: `individual@example.com` / `Password123!`
              </p>
            </article>
          </section>
        </div>
      </main>
    </>
  );
}