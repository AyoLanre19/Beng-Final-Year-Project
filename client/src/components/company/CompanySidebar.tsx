import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import "../../styles/company-sidebar.css";

interface CompanySidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CompanySidebar({
  isOpen = false,
  onClose,
}: CompanySidebarProps) {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logoutUser();
    navigate("/company/login");
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        className={`company-sidebar-backdrop ${isOpen ? "visible" : ""}`}
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside className={`company-sidebar ${isOpen ? "is-open" : ""}`}>

        <div className="company-sidebar-head">
          <div className="sidebar-logo">
            <span>Logo</span>
          </div>

          <button
            type="button"
            className="company-sidebar-close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <nav className="sidebar-menu">

          <Link
            to="/company/dashboard"
            className={isActive("/company/dashboard") ? "active" : ""}
            onClick={onClose}
          >
            Dashboard
          </Link>

          <Link
            to="/company/upload"
            className={isActive("/company/upload") ? "active" : ""}
            onClick={onClose}
          >
            Financial Data Upload
          </Link>

          <Link
            to="/company/tax-summary"
            className={isActive("/company/tax-summary") ? "active" : ""}
            onClick={onClose}
          >
            Tax Summary
          </Link>

          <Link
            to="/company/filing"
            className={isActive("/company/filing") ? "active" : ""}
            onClick={onClose}
          >
            Review & File
          </Link>

        </nav>

        <div className="sidebar-footer">
          <button type="button" onClick={handleLogout}>Log out</button>
        </div>

      </aside>
    </>
  );
}
