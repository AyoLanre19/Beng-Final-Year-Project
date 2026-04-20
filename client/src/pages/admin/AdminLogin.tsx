import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-auth.css";
import { loginUser, logoutUser } from "../../services/authService";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const response = await loginUser({ email, password });

      if (response.data.user.role !== "admin") {
        logoutUser();
        setError("This account is not authorized for admin access.");
        return;
      }

      navigate("/admin/dashboard");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Unable to login to the admin portal."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card glass">
        <div className="logo-box">Logo</div>

        <h1>Admin Login</h1>
        <p className="subtitle">
          Secure admin authentication for live platform management
        </p>

        <div className="form-box">
          <h3>Sign in to your account</h3>

          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {error ? <p className="forgot" style={{ color: "#c62828" }}>{error}</p> : null}

          <div className="secure-box">
            🔒 Secure Admin Access Only
            <br />
            <small>
              Use an account with the admin role stored in the database.
            </small>
          </div>
        </div>

        <p className="note">
          Admin actions now use the real backend and database records.
        </p>

        <p className="footer">
          Tax Automation Platform - Admin Access
        </p>
      </div>
    </div>
  );
}
