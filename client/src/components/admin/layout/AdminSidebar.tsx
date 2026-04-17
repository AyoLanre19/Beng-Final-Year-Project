import { useNavigate, useLocation } from "react-router-dom";
import "./admin-layout.css";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "⌂" },
    { label: "Users", path: "/admin/users", icon: "📄" },
    { label: "Filings", path: "/admin/filings", icon: "⚙" },
    { label: "AI Monitoring", path: "/admin/ai-monitoring", icon: "✺" },
    
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__top">
        <div className="admin-logo-box">
          <div className="admin-logo-icon">T</div>
          <span className="admin-logo-text">Logo</span>
        </div>

        <nav className="admin-sidebar__nav">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                className={`admin-nav-item ${isActive ? "active" : ""}`}
                onClick={() => navigate(item.path)}
                type="button"
              >
                <span className="admin-nav-item__left">
                  <span className="admin-nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </span>

                {item.label !== "System Settings" && (
                  <span className="admin-nav-arrow">›</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <button className="admin-logout" onClick={handleLogout} type="button">
        <span className="admin-logout__icon">⌄</span>
        <span>Log out</span>
      </button>
    </aside>
  );
}