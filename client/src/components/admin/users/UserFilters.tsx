export default function UserFilters() {
  return (
    <section className="users-filter-card">
      <div className="users-filter-top">
        <div className="users-search-box">
          <span className="users-search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by name, email, or TIN..."
          />
        </div>

        <button type="button" className="apply-filter-btn">
          <span className="apply-filter-icon">⌁</span>
          <span>Apply Filters</span>
        </button>
      </div>

      <div className="users-filter-grid">
        <div className="filter-group">
          <label>User Type</label>
          <select>
            <option>All Types</option>
            <option>Individual</option>
            <option>SME</option>
            <option>Company</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Status</label>
          <select>
            <option>All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Flagged</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filing Status</label>
          <select>
            <option>All Filing Status</option>
            <option>Filed</option>
            <option>Pending</option>
            <option>Draft</option>
            <option>Not Started</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Risk Score</label>
          <select>
            <option>All Risk Levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <button type="button" className="reset-filter-btn">
          ↻ Reset
        </button>
      </div>
    </section>
  );
}