import "./admin-layout.css";

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function AdminTopbar({
  onToggleSidebar,
  isSidebarOpen = false,
}: AdminTopbarProps) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button
          type="button"
          className="admin-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="admin-search">
          <span className="admin-search__icon">Q</span>
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="admin-topbar__right">
        <button className="admin-topbar__icon small-cyan" type="button">
          RP
        </button>

        <button className="admin-topbar__icon small-purple" type="button">
          TX
        </button>

        <button className="admin-topbar__icon small-blue has-badge" type="button">
          NT
          <span className="badge">4</span>
        </button>

        <div className="admin-profile">
          <img
            src="https://i.pravatar.cc/80?img=12"
            alt="Admin profile"
          />
          <span>ifeanyi</span>
        </div>
      </div>
    </header>
  );
}
