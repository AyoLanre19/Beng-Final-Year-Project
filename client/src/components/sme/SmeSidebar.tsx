import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/authService";
import "../../styles/sme-dashboard.css";

interface SmeSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SmeSidebar({
  isOpen = false,
  onClose,
}: SmeSidebarProps) {

  const navigate = useNavigate();
  const location = useLocation();

  const active = (path: string) =>
    location.pathname === path ? "sme-nav-item active" : "sme-nav-item";

  const go = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        className={`sme-sidebar-backdrop ${isOpen ? "visible" : ""}`}
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside className={`sme-sidebar ${isOpen ? "is-open" : ""}`}>

        <div className="sme-sidebar-head">
          <div className="sme-logo">Logo</div>

          <button
            type="button"
            className="sme-sidebar-close"
            aria-label="Close navigation menu"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <nav className="sme-nav">

          <button
            className={active("/sme/dashboard")}
            onClick={() => go("/sme/dashboard")}
          >
            Dashboard
          </button>

          <button
            className={active("/sme/revenue-expenses")}
            onClick={() => go("/sme/revenue-expenses")}
          >
            Revenue & Expenses
          </button>

          <button
            className={active("/sme/tax-summary")}
            onClick={() => go("/sme/tax-summary")}
          >
            Tax Summary
          </button>

          <button
            className={active("/sme/file-tax")}
            onClick={() => go("/sme/file-tax")}
          >
            Review & File
          </button>

        </nav>

        <div className="sme-logout">
          <button onClick={() => {
            logoutUser();
            go("/sme/login");
          }}>
            Log out
          </button>
        </div>

      </aside>
    </>
  );
}
