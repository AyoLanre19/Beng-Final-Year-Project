import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../../services/authService";
import { clearStoredToken } from "../../services/apiClient";
import "../../styles/company-sidebar.css";

export default function CompanySidebar() {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    clearStoredToken();
    clearStoredUser();
    localStorage.removeItem("portalType");
    localStorage.removeItem("companyVerified");
    navigate("/company/login");
  };

  return (
    <aside className="company-sidebar">

      <div className="sidebar-logo">
        <span>Logo</span>
      </div>

      <nav className="sidebar-menu">

        <Link
          to="/company/dashboard"
          className={isActive("/company/dashboard") ? "active" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/company/upload"
          className={isActive("/company/upload") ? "active" : ""}
        >
          Financial Data Upload
        </Link>

        <Link
          to="/company/tax-summary"
          className={isActive("/company/tax-summary") ? "active" : ""}
        >
          Tax Summary
        </Link>

        <Link
          to="/company/filing"
          className={isActive("/company/filing") ? "active" : ""}
        >
          Review & File
        </Link>

      </nav>

      <div className="sidebar-footer">
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>

    </aside>
  );
}