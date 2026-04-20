import { useNavigate, useLocation } from "react-router-dom";
import "./admin-layout.css";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "DB" },
    { label: "Users", path: "/admin/users", icon: "US" },
    { label: "Filings", path: "/admin/filings", icon: "FL" },
    { label: "AI Monitoring", path: "/admin/ai-monitoring", icon: "AI" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
    onClose?.();
  };

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-backdrop ${isOpen ? "visible" : ""}`}
        aria-label="Close navigation menu"
        onClick={onClose}
      />

      <aside className={`admin-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="admin-sidebar__top">
          <div className="admin-sidebar__head">
            <div className="admin-logo-box">
              <div className="admin-logo-icon">T</div>
              <span className="admin-logo-text">Logo</span>
            </div>

            <button
              type="button"
              className="admin-sidebar-close"
              aria-label="Close navigation menu"
              onClick={onClose}
            >
              x
            </button>
          </div>

          <nav className="admin-sidebar__nav">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={item.path}
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    navigate(item.path);
                    onClose?.();
                  }}
                  type="button"
                >
                  <span className="admin-nav-item__left">
                    <span className="admin-nav-icon">{item.icon}</span>
                    <span>{item.label}</span>
                  </span>

                  <span className="admin-nav-arrow">&gt;</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button className="admin-logout" onClick={handleLogout} type="button">
          <span className="admin-logout__icon">O</span>
          <span>Log out</span>
        </button>
      </aside>
    </>
  );
}
