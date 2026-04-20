import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import "../../styles/admin-ai-monitoring.css";
import {
  fetchAdminAiMonitoring,
  type AdminAiMonitoring,
} from "../../services/adminService";

const COLORS = ["#4f8dff", "#ffd166", "#ef476f"];

export default function AiMonitoringPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [monitoring, setMonitoring] = useState<AdminAiMonitoring | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMonitoring = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminAiMonitoring();
        setMonitoring(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load AI monitoring.");
      } finally {
        setLoading(false);
      }
    };

    void loadMonitoring();
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
            <div className="ai-page-header">
              <h1 className="admin-page-title">AI Monitoring</h1>
            </div>
            {error ? <p className="admin-page-subtitle" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="admin-page-subtitle">Loading AI monitoring...</p>
            ) : monitoring ? (
              <>
                <section className="ai-metrics-row">
                  <div className="ai-metric-card">
                    <div className="metric-main">
                      <strong>{monitoring.overallAccuracy}%</strong>
                      <span>Overall Accuracy</span>
                    </div>
                  </div>
                  <div className="ai-metric-card">
                    <div className="metric-main">
                      <strong>{monitoring.totalTransactionsProcessed}</strong>
                      <span>Total Transactions Processed</span>
                    </div>
                  </div>
                  <div className="ai-metric-card">
                    <div className="metric-main">
                      <strong>{monitoring.averageConfidence}%</strong>
                      <span>Average Confidence</span>
                    </div>
                  </div>
                </section>

                <section className="ai-chart-grid">
                  <section className="ai-monitor-card">
                    <h3 className="ai-card-heading">AI Accuracy Trend</h3>
                    <div style={{ width: "100%", height: 230 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={monitoring.accuracyTrend}
                          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                          <CartesianGrid stroke="#eef2fa" vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(value) => [`${Number(value)}%`, "Accuracy"]} />
                          <Line type="monotone" dataKey="accuracy" stroke="#4f8dff" strokeWidth={3} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  <section className="ai-monitor-card">
                    <h3 className="ai-card-heading">Error Types</h3>
                    <div style={{ width: "100%", height: 230 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={monitoring.errorTypes} dataKey="value" nameKey="label" innerRadius={45} outerRadius={75}>
                            {monitoring.errorTypes.map((item, index) => (
                              <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </section>
                </section>

                <section className="ai-bottom-grid">
                  <section className="ai-monitor-card misclassifications-card">
                    <div className="misclassifications-header">
                      <h3 className="ai-card-heading">Recent Low Confidence / Uncategorized Transactions</h3>
                    </div>

                    <div className="ai-table-wrap">
                      <table className="ai-monitor-table">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>User</th>
                            <th>Description</th>
                            <th>Detected Category</th>
                            <th>Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          {monitoring.recentIssues.map((issue) => (
                            <tr key={`${issue.userId}-${issue.description}-${issue.date || "undated"}`}>
                              <td>{issue.date || "No date"}</td>
                              <td>{issue.user}</td>
                              <td>{issue.description}</td>
                              <td>{issue.aiCategory}</td>
                              <td>{issue.confidence !== null ? `${issue.confidence}%` : "Pending"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="ai-monitor-card alerts-card">
                    <h3 className="ai-card-heading">Model Health Alerts</h3>

                    <div className="alert-stack">
                      {monitoring.alerts.map((alert) => (
                        <div className="health-alert warning" key={alert}>
                          {alert}
                        </div>
                      ))}
                    </div>
                  </section>
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
