export default function UserDetailsCard() {
  return (
    <section className="filing-card user-details-card">
      <div className="filing-card-title">
        <span className="filing-card-icon">👤</span>
        <h3>User Details</h3>
      </div>

      <div className="user-profile-block">
        <div className="user-avatar">👨🏽</div>

        <div>
          <h4 className="user-profile-name">John Doe</h4>
          <span className="user-type-badge">Individual</span>
        </div>
      </div>

      <div className="user-info-list">
        <div className="user-info-row">
          <span className="user-info-icon">✉</span>
          <span>john.doe@email.com</span>
        </div>

        <div className="user-info-row">
          <span className="user-info-icon">🪪</span>
          <span>TIN: 12345678-9000</span>
        </div>

        <div className="user-info-row">
          <span className="user-info-icon">⚙</span>
          <span>
            Status: <span className="mini-status-badge active">Active</span>
          </span>
        </div>

        <div className="user-info-row">
          <span className="user-info-icon">🕒</span>
          <span>Filing Date: 2024-03-25 14:30:22</span>
        </div>
      </div>

      <div className="filing-summary-box">
        <h4>Filing Summary</h4>

        <div className="summary-row">
          <span>Reference:</span>
          <strong>TX-2024-0425-001</strong>
        </div>

        <div className="summary-row">
          <span>Tax Period:</span>
          <strong>Q1 2024</strong>
        </div>

        <div className="summary-row">
          <span>Status:</span>
          <span className="review-status-badge">Pending Review</span>
        </div>
      </div>
    </section>
  );
}