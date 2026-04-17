import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/admin-auth.css";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 MVP fake auth (replace with backend later)
    if (email === "admin@example.com" && password === "admin123") {
      localStorage.setItem(
        "token",
        "fake-jwt-token"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({ role: "admin", email })
      );

      navigate("/admin/dashboard");
    } else {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="admin-auth-page">
      <div className="admin-auth-card glass">

        {/* Logo */}
        <div className="logo-box">Logo</div>

        <h1>Admin Login</h1>
        <p className="subtitle">
          MVP admin authentication for tax automation
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

            <button type="submit">Sign In</button>
          </form>

          <p className="forgot">Forgot password?</p>

          <div className="secure-box">
            🔒 Secure Admin Access Only  
            <br />
            <small>
              Use your admin email and password to access.
            </small>
          </div>
        </div>

        <p className="note">
          ⚠️ For security, always use strong passwords and keep them confidential.
        </p>

        <p className="footer">
          MVP Tax Automation – Secure Admin Access
        </p>
      </div>
    </div>
  );
}