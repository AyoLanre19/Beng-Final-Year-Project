import PortalAccountControls from "../portal/PortalAccountControls";
import "../../styles/company-topbar.css";

interface CompanyTopbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function CompanyTopbar({
  onToggleSidebar,
  isSidebarOpen = false,
}: CompanyTopbarProps) {
  return (
    <header className="company-topbar">
      <div className="company-topbar__start">
        <button
          type="button"
          className="company-menu-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isSidebarOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <input
          type="text"
          placeholder="Search reports, documents, and filings"
          className="search-input"
        />
      </div>

      <PortalAccountControls portal="company" />
    </header>
  );
}
