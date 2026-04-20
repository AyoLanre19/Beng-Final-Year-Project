import { useEffect, useState } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";
import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";
import MetricCard from "../../components/individual/MetricCard";
import { IncomeDonut, IncomeLine } from "../../components/individual/Charts";
import {
  USER_CHANGED_EVENT,
  getStoredUser,
  getUserDisplayName,
} from "../../services/authService";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../../services/dashboardService";
import "../../styles/individual-dashboard.css";

const formatCurrency = (value: number) => `N${value.toLocaleString("en-NG")}`;

const formatPaymentStatus = (status: DashboardMetrics["paymentStatus"]) => {
  if (status === "underpaid") return "Underpaid";
  if (status === "overpaid") return "Overpaid";
  if (status === "draft") return "Draft";
  return "Up to date";
};

const formatRiskLabel = (riskScore: number) => {
  if (riskScore >= 60) return "High Risk";
  if (riskScore >= 30) return "Medium Risk";
  return "Low Risk";
};

export default function IndividualDashboard(): JSX.Element {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState(() => getUserDisplayName(getStoredUser()));
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const syncUserName = () => {
      setDisplayName(getUserDisplayName(getStoredUser()));
    };

    window.addEventListener(USER_CHANGED_EVENT, syncUserName);
    return () => window.removeEventListener(USER_CHANGED_EVENT, syncUserName);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics("individual");
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className={`ind-page ${sidebarOpen ? "sidebar-open" : ""}`}>
      <IndividualSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ind-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="ind-content">
          <h1 className="page-h1">Dashboard</h1>

          <p className="page-sub">Welcome back, {displayName}!</p>
          {error && <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>}

          {loading ? (
            <p className="page-sub">Loading dashboard data...</p>
          ) : (
            <>
              <div className="metrics-row">
                <MetricCard title="Total Income Detected">
                  {formatCurrency(dashboard?.totalIncome ?? 0)}
                </MetricCard>

                <MetricCard title="Estimated Tax">
                  {formatCurrency(dashboard?.estimatedTax ?? 0)}
                </MetricCard>

                <MetricCard title="Overpayment / Underpayment">
                  <div className="over-under">{formatPaymentStatus(dashboard?.paymentStatus ?? "draft")}</div>
                </MetricCard>

                <MetricCard title="AI Risk Score">
                  <div className="risk-visual">
                    <div className="risk-circle">{dashboard?.riskScore ?? 0}%</div>
                    <div className="risk-label">{formatRiskLabel(dashboard?.riskScore ?? 0)}</div>
                  </div>
                </MetricCard>
              </div>

              <div className="row-two">
                <div className="upload-col">
                  <div className="upload-card">
                    <div className="upload-title">Upload Bank Statement</div>

                    <button
                      className="btn-primary"
                      onClick={() => navigate("/individual/income-deductions")}
                    >
                      Upload Bank Statement
                    </button>

                    <div className="muted">
                      Upload your latest bank statement for automatic tax analysis. PDF, CSV
                    </div>
                  </div>

                  <div className="chart-row">
                    <IncomeLine data={dashboard?.monthlyIncomeData} />
                  </div>
                </div>

                <div className="side-col">
                  <div className="filling-card">
                    <div className="small-label">Filing Status</div>

                    <div className="f-status">{dashboard?.filingStatus?.replace("_", " ") || "not started"}</div>

                    <button
                      className="btn-secondary"
                      onClick={() => navigate("/individual/tax-summary")}
                    >
                      Review & File
                    </button>
                  </div>

                  <IncomeDonut data={dashboard?.incomeSourceData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
