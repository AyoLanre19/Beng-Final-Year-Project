import { useNavigate } from "react-router-dom";
import "../../../styles/admin-dashboard.css";

const data = [
  {
    name: "John Doe",
    email: "john@oemail.com",
    type: "Individual",
    status: "Filed",
    risk: "Low",
  },
  {
    name: "ABC Ltd",
    email: "@_mpi.com",
    type: "SME",
    status: "Pending",
    risk: "Medium",
  },
  {
    name: "XYZ Nigeria",
    email: "@_xita - 6.0",
    type: "Company",
    status: "Draft",
    risk: "High",
  },
  {
    name: "Sarah Smith",
    email: "@_xita - 6.0",
    type: "Individual",
    status: "Filed",
    risk: "Low",
  },
];

export default function RecentActivityTable() {
  const navigate = useNavigate();

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "filed":
        return "badge badge-status badge-filed";
      case "pending":
        return "badge badge-status badge-pending";
      case "draft":
        return "badge badge-status badge-draft";
      default:
        return "badge";
    }
  };

  const getRiskClass = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "badge badge-risk badge-low";
      case "medium":
        return "badge badge-risk badge-medium";
      case "high":
        return "badge badge-risk badge-high";
      default:
        return "badge";
    }
  };

  return (
    <section className="recent-activity-card">
      <div className="recent-activity-header">
        <h3>Recent User Activity</h3>
        <button
          type="button"
          className="view-all-btn"
          onClick={() => navigate("/admin/users")}
        >
          View All
        </button>
      </div>

      <div className="recent-activity-table-wrap">
        <table className="recent-activity-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Filing Status</th>
              <th>Risk Score</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>
                  <div className="user-cell">
                    <div className="user-icon">👤</div>
                    <div>
                      <p className="user-name">{row.name}</p>
                      <span className="user-email">{row.email}</span>
                    </div>
                  </div>
                </td>

                <td>{row.type}</td>

                <td>
                  <span className={getStatusClass(row.status)}>
                    {row.status}
                  </span>
                </td>

                <td>
                  <span className={getRiskClass(row.risk)}>
                    {row.risk}
                  </span>
                </td>

                <td>
                  <button
                    type="button"
                    className="view-btn"
                    onClick={() => navigate("/admin/users")}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}