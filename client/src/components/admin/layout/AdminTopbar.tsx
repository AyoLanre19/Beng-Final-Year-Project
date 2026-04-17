import "./admin-layout.css";

export default function AdminTopbar() {
  return (
    <header className="admin-topbar">
      <div className="admin-search">
        <span className="admin-search__icon">⌕</span>
        <input type="text" placeholder="Search" />
      </div>

      <div className="admin-topbar__right">
        <button className="admin-topbar__icon small-cyan" type="button">
          ▣
        </button>

        <button className="admin-topbar__icon small-purple" type="button">
          ⌂
        </button>

        <button className="admin-topbar__icon small-blue has-badge" type="button">
          ✈
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