import { useNavigate, useLocation } from "react-router-dom";
import "../../styles/sme-dashboard.css";

export default function SmeSidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  const active = (path: string) =>
    location.pathname === path ? "sme-nav-item active" : "sme-nav-item";

  return (
    <aside className="sme-sidebar">

      <div className="sme-logo">Logo</div>

      <nav className="sme-nav">

        <button
          className={active("/sme/dashboard")}
          onClick={() => navigate("/sme/dashboard")}
        >
          Dashboard
        </button>

        <button
          className={active("/sme/revenue-expenses")}
          onClick={() => navigate("/sme/revenue-expenses")}
        >
          Revenue & Expenses
        </button>

        <button
          className={active("/sme/tax-summary")}
          onClick={() => navigate("/sme/tax-summary")}
        >
          Tax Summary
        </button>

        <button
          className={active("/sme/file-tax")}
          onClick={() => navigate("/sme/file-tax")}
        >
          Review & File
        </button>

      </nav>

      {/* LOGOUT AT BOTTOM */}
      <div className="sme-logout">
        <button onClick={() => navigate("/login")}>
          Log out
        </button>
      </div>

    </aside>
  );
}