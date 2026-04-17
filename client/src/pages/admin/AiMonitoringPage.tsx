import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import AiMetricsRow from "../../components/admin/ai-monitoring/AiMetricsRow";
import AiAccuracyChart from "../../components/admin/ai-monitoring/AiAccuracyChart";
import ErrorTypesChart from "../../components/admin/ai-monitoring/ErrorTypesChart";
import MisclassificationsTable from "../../components/admin/ai-monitoring/MisclassificationsTable";
import ModelHealthAlerts from "../../components/admin/ai-monitoring/ModelHealthAlerts";
import "../../styles/admin-layout.css";
import "../../styles/admin-ai-monitoring.css";

export default function AiMonitoringPage() {
  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="dashboard-content">
          <AdminTopbar />

          <main className="admin-page-inner">
            <div className="ai-page-header">
              <h1 className="admin-page-title">AI Monitoring</h1>
            </div>

            <AiMetricsRow />

            <section className="ai-chart-grid">
              <AiAccuracyChart />
              <ErrorTypesChart />
            </section>

            <section className="ai-bottom-grid">
              <MisclassificationsTable />
              <ModelHealthAlerts />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}