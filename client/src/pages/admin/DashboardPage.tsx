import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import "../../styles/admin-dashboard.css";
import {
  fetchAdminOverview,
  type AdminOverview,
} from "../../services/adminService";

const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminOverview();
        setOverview(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin overview.");
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, []);

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
            <h1 className="admin-page-title">Admin Dashboard</h1>
            <p className="admin-page-subtitle">Live platform activity from the database.</p>
            {error ? <p className="admin-page-subtitle" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="admin-page-subtitle">Loading admin overview...</p>
            ) : overview ? (
              <>
                <div className="admin-metrics-grid">
                  <div className="stat-card">
                    <div className="stat-card-title">Total Users</div>
                    <div className="stat-card-value">{overview.metrics.totalUsers}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-title">Filings Submitted</div>
                    <div className="stat-card-value">{overview.metrics.filingsSubmitted}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-title">Total Tax Estimated</div>
                    <div className="stat-card-value">{formatCurrency(overview.metrics.totalTaxEstimated)}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-title">AI Accuracy</div>
                    <div className="stat-card-value">{overview.metrics.aiAccuracy}%</div>
                  </div>
                </div>

                <div className="admin-dashboard-charts">
                  <section className="admin-chart-card">
                    <h3>Submitted Filings</h3>
                    <div className="admin-chart-shell">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={overview.filingsTrend}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="filings" stroke="#4f8dff" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section className="admin-chart-card">
                    <h3>User Growth</h3>
                    <div className="admin-chart-shell">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={overview.userGrowth}>
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area dataKey="users" fill="#b7caff" stroke="#5f88ff" strokeWidth={3} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                </div>

                <section className="recent-activity-card">
                  <div className="recent-activity-header">
                    <h3>Recent User Activity</h3>
                  </div>

                  <div className="recent-activity-table-wrap">
                    <table className="recent-activity-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Filing Status</th>
                          <th>Risk Score</th>
                        </tr>
                      </thead>

                      <tbody>
                        {overview.recentActivity.map((row) => (
                          <tr key={row.userId}>
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
                            <td>{row.filingStatus}</td>
                            <td>{row.risk}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
