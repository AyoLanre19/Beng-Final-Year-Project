import PortalAccountControls from "../portal/PortalAccountControls";
import "../../styles/sme-dashboard.css";

interface SmeTopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function SmeTopbar({
  onToggleSidebar,
  isSidebarOpen = false,
}: SmeTopbarProps) {
  return (
    <div className="sme-topbar">
      <div className="sme-topbar__start">
        <button
          type="button"
          className="sme-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <input
          className="sme-search"
          placeholder="Search revenue, expenses, and returns"
        />
      </div>

      <PortalAccountControls portal="sme" />
    </div>
  );
}
