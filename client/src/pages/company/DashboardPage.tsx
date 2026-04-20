import { useEffect, useState } from "react";
import "../../styles/company-dashboard.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import MetricsRow from "../../components/company/CompanyDashboard/MetricsRow";
import RiskCard from "../../components/company/CompanyDashboard/RiskCard";
import RevenueChart from "../../components/company/CompanyDashboard/RevenueChart";
import ExpenseChart from "../../components/company/CompanyDashboard/ExpenseChart";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../../services/dashboardService";

export default function CompanyDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics("company");
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load company dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className={`company-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <CompanySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="company-main">
        <CompanyTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="company-content">
          <div className="company-page">
            <div className="dashboard-header">
              <h2>Dashboard</h2>
            </div>

            {error ? <p className="page-sub" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="page-sub">Loading company dashboard...</p>
            ) : (
              <>
                <MetricsRow
                  totalRevenue={dashboard?.totalRevenue ?? dashboard?.totalIncome ?? 0}
                  totalExpenses={dashboard?.totalExpenses ?? 0}
                  estimatedTax={dashboard?.estimatedTax ?? 0}
                  vatEstimate={dashboard?.vatEstimate ?? 0}
                />

                <RiskCard
                  riskScore={dashboard?.riskScore ?? 0}
                  estimatedTax={dashboard?.estimatedTax ?? 0}
                />

                <div className="charts-grid">
                  <RevenueChart data={dashboard?.monthlyIncomeData ?? []} />
                  <ExpenseChart data={dashboard?.expenseBreakdownData ?? []} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
