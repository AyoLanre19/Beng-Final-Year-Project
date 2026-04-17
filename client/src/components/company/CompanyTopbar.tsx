import "../../styles/company-topbar.css";

export default function CompanyTopbar() {
  return (
    <header className="company-topbar">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search"
        className="search-input"
      />

      {/* ACTIONS */}
      <div className="topbar-actions">

        <div className="icon-box">📊</div>
        <div className="icon-box">📩</div>

        {/* 🔔 NO RED DOT ANYMORE */}
        <div className="icon-box">
          🔔
        </div>

        {/* USER */}
        <div className="user-box">
          <img
            src="/assets/images/avatar.png"
            alt="user"
          />
          <span>Ifeanyi</span>
        </div>

      </div>

    </header>
  );
}