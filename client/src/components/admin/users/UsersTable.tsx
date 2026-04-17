import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FlagUserPopover from "./FlagUserPopover";
import ContactUserPopover from "./ContactUserPopover";

type UserRecord = {
  id: number;
  name: string;
  email: string;
  type: "Individual" | "SME" | "Company";
  tin: string;
  status: "Active" | "Inactive" | "Flagged";
  filingStatus: "Filed" | "Pending" | "Draft" | "Not Started";
  riskScore: "Low" | "Medium" | "High";
  lastActive: string;
};

const users: UserRecord[] = [
  { id: 1, name: "John Doe", email: "john@doemail.com", type: "Individual", tin: "12345678-9000", status: "Active", filingStatus: "Filed", riskScore: "Low", lastActive: "2024-03-15" },
  { id: 2, name: "ABC Ltd", email: "contact@abcltd.ng", type: "SME", tin: "98765432-1000", status: "Active", filingStatus: "Pending", riskScore: "Medium", lastActive: "2024-03-14" },
  { id: 3, name: "XYZ Nigeria", email: "info@xyznigeria.com", type: "Company", tin: "45678901-2000", status: "Flagged", filingStatus: "Draft", riskScore: "High", lastActive: "2024-03-13" },
  { id: 4, name: "Sarah Smith", email: "sarah@email.com", type: "Individual", tin: "23456789-1000", status: "Active", filingStatus: "Filed", riskScore: "Low", lastActive: "2024-03-12" },
  { id: 5, name: "GreenTech Solutions", email: "admin@greentech.ng", type: "SME", tin: "34567890-1000", status: "Active", filingStatus: "Pending", riskScore: "Medium", lastActive: "2024-03-11" },
  { id: 6, name: "Mega Corp Ltd", email: "tax@megacorp.com", type: "Company", tin: "56789012-3000", status: "Inactive", filingStatus: "Not Started", riskScore: "Low", lastActive: "2024-03-10" },
  { id: 7, name: "Mike Johnson", email: "mike@email.com", type: "Individual", tin: "34567891-9000", status: "Active", filingStatus: "Draft", riskScore: "High", lastActive: "2024-03-09" },
  { id: 8, name: "FirstBank Nigeria", email: "tax@firstbank.ng", type: "Company", tin: "67890123-0000", status: "Flagged", filingStatus: "Pending", riskScore: "Medium", lastActive: "2024-03-08" },
];

export default function UsersTable() {
  const navigate = useNavigate();
  const [flagUserId, setFlagUserId] = useState<number | null>(null);
  const [contactUserId, setContactUserId] = useState<number | null>(null);

  const typeClass = (type: UserRecord["type"]) => {
    if (type === "Individual") return "pill pill-type-individual";
    if (type === "SME") return "pill pill-type-sme";
    return "pill pill-type-company";
  };

  const statusClass = (status: UserRecord["status"]) => {
    if (status === "Active") return "pill pill-status-active";
    if (status === "Inactive") return "pill pill-status-inactive";
    return "pill pill-status-flagged";
  };

  const filingClass = (status: UserRecord["filingStatus"]) => {
    if (status === "Filed") return "pill pill-filed";
    if (status === "Pending") return "pill pill-pending";
    if (status === "Draft") return "pill pill-draft";
    return "pill pill-not-started";
  };

  const riskClass = (risk: UserRecord["riskScore"]) => {
    if (risk === "Low") return "pill pill-low";
    if (risk === "Medium") return "pill pill-medium";
    return "pill pill-high";
  };

  return (
    <section className="users-table-card">
      <div className="users-table-title">All Users <span>(1,247 total)</span></div>

      <div className="users-table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>TIN / Tax ID</th>
              <th>Status</th>
              <th>Filing Status</th>
              <th>Risk Score</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-main-cell">
                    <div className="user-table-icon">👤</div>
                    <div>
                      <div className="user-main-name">{user.name}</div>
                      <div className="user-main-email">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td><span className={typeClass(user.type)}>{user.type}</span></td>
                <td>{user.tin}</td>
                <td><span className={statusClass(user.status)}>{user.status}</span></td>
                <td><span className={filingClass(user.filingStatus)}>{user.filingStatus}</span></td>
                <td><span className={riskClass(user.riskScore)}>{user.riskScore}</span></td>
                <td>{user.lastActive}</td>
          <td className="actions-cell">
  <div className="action-links">
    <button
      type="button"
      onClick={() => navigate("/admin/filings")}
    >
      View
    </button>

    <button
      type="button"
      className="flag-link"
      onClick={() => {
        setContactUserId(null);
        setFlagUserId(flagUserId === user.id ? null : user.id);
      }}
    >
      Flag
    </button>

    <button
      type="button"
      onClick={() => {
        setFlagUserId(null);
        setContactUserId(contactUserId === user.id ? null : user.id);
      }}
    >
      Contact
    </button>
  </div>

  {flagUserId === user.id && (
    <div className="row-popover row-popover-left">
      <FlagUserPopover onClose={() => setFlagUserId(null)} />
    </div>
  )}

  {contactUserId === user.id && (
    <div className="row-popover row-popover-right">
      <ContactUserPopover onClose={() => setContactUserId(null)} />
    </div>
  )}
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     <div className="users-pagination">
  <span>Showing 1 to 8 of 1,247 users</span>

  <div className="pagination-box">
    <button type="button">‹</button>
    <button type="button" className="active">1</button>
    <button type="button">2</button>
    <button type="button">3</button>
    <button type="button">4</button>
    <button type="button">5</button>
    <span>...</span>
    <button type="button">63</button>
    <button type="button">›</button>
  </div>
</div>
    </section>
  );
}