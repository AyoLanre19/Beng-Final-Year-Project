import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import "../../styles/admin-users.css";
import {
  deleteAdminUser,
  fetchAdminUsers,
  type AdminUserRecord,
} from "../../services/adminService";

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminUsers();
        setUsers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin users.");
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Delete this user account and all linked records?")) {
      return;
    }

    try {
      await deleteAdminUser(userId);
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete the user account.");
    }
  };

  return (
    <div className="admin-layout">
      <div className={`admin-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="dashboard-content">
          <AdminTopbar
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            isSidebarOpen={sidebarOpen}
          />

          <main className="admin-page-inner">
            <h1 className="admin-page-title">User Monitoring</h1>
            <p className="admin-page-subtitle">
              Live users from the database with real delete-account authority.
            </p>
            {error ? <p className="admin-page-subtitle" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="admin-page-subtitle">Loading users...</p>
            ) : (
              <section className="users-table-card">
                <div className="users-table-title">
                  All Users <span>({users.length} total)</span>
                </div>

                <div className="users-table-wrap">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Filing Status</th>
                        <th>Risk</th>
                        <th>Uploads</th>
                        <th>Filings</th>
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
                          <td>{user.type}</td>
                          <td>{user.status}</td>
                          <td>{user.filingStatus}</td>
                          <td>{user.riskScore} ({user.riskPercent}%)</td>
                          <td>{user.uploads}</td>
                          <td>{user.filings}</td>
                          <td>{user.lastActive ? new Date(user.lastActive).toLocaleString("en-NG") : "No activity"}</td>
                          <td>
                            <button
                              type="button"
                              className="flag-link"
                              onClick={() => void handleDelete(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
