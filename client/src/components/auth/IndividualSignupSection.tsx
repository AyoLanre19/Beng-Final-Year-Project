import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, type UserType } from "../../services/authService";
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

  const heading = portal === "sme" ? "Create Your SME Account" : "Create Your Individual Account";
  const description = portal === "sme"
    ? "Set up your SME portal to manage business revenue, expenses, and filing."
    : "Set up your individual portal to manage income, deductions, and tax filing.";

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

      localStorage.setItem("portalType", response.data.user.userType);
      navigate(`/${response.data.user.userType}/login`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-wrapper">
        <div className="auth-hero glass">
          <img src="/assets/images/signup-hero.png" alt="Sign up illustration" />

          <h1>{heading}</h1>

          <p>{description}</p>
        </div>

        <form className="auth-card glass" onSubmit={handleSignup}>
          <h3>{portal === "sme" ? "SME Sign Up" : "Individual Sign Up"}</h3>
          <p>{portal === "sme" ? "Use your business contact details to create your SME workspace." : "Use your personal details to create your individual workspace."}</p>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="switch" style={{ color: "#c62828" }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <p className="switch">
            Already have an account?
            <a href={`/${portal}/login`}> Login</a>
          </p>
        </form>
      </section>
    </main>
  );
}