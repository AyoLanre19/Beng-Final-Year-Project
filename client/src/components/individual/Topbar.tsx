import PortalAccountControls from "../portal/PortalAccountControls";
import "../../styles/individual-dashboard.css";

interface TopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function Topbar({
  onToggleSidebar,
  isSidebarOpen = false,
}: TopbarProps) {
  return (
    <header className="ind-topbar">
      <div className="ind-topbar__left">
        <button
          type="button"
          className="ind-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="ind-topbar__search">
          <input placeholder="Search your records, deductions, and filings" aria-label="search" />
        </div>
      </div>

      <PortalAccountControls portal="individual" />
    </header>
  );
}
