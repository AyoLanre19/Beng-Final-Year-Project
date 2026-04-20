import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import StatCard from "../../components/sme/smedashboard/StatCard";
import RevenueChart from "../../components/sme/smedashboard/RevenueChart";
import IncomeExpenseChart from "../../components/sme/smedashboard/IncomeExpenseChart";
import {
  USER_CHANGED_EVENT,
  getStoredUser,
  getUserDisplayName,
} from "../../services/authService";
import {
  getDashboardMetrics,
  type DashboardMetrics,
} from "../../services/dashboardService";
import "../../styles/sme-dashboard.css";

const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export default function SmeDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [displayName, setDisplayName] = useState(() => getUserDisplayName(getStoredUser()));
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const syncUserName = () => setDisplayName(getUserDisplayName(getStoredUser()));
    window.addEventListener(USER_CHANGED_EVENT, syncUserName);

    return () => window.removeEventListener(USER_CHANGED_EVENT, syncUserName);
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics("sme");
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load SME dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className={`sme-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SmeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sme-main">
        <SmeTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="sme-content">
          <h1>Dashboard</h1>
          <p>Welcome back, {displayName}!</p>
          {error ? <p style={{ color: "#c62828" }}>{error}</p> : null}

          {loading ? (
            <p>Loading SME dashboard...</p>
          ) : (
            <>
              <div className="sme-cards">
                <StatCard title="Total Revenue Detected" value={formatCurrency(dashboard?.totalRevenue ?? dashboard?.totalIncome ?? 0)} />
                <StatCard title="Estimated Tax" value={formatCurrency(dashboard?.estimatedTax ?? 0)} />
                <StatCard title="VAT Estimate" value={formatCurrency(dashboard?.vatEstimate ?? 0)} />
                <StatCard title="Filing Status" value={dashboard?.filingStatus?.replace("_", " ") || "Not Started"} />
              </div>

                <div className="upload-box">
                  <h3>Saved Upload Data</h3>
                  <button className="upload-btn" onClick={() => navigate("/sme/revenue-expenses")}>
                    Open Revenue & Expenses
                  </button>
                <p>Your charts and figures now follow the saved uploads on this SME account.</p>
              </div>

              <div className="charts">
                <RevenueChart data={dashboard?.monthlyIncomeData ?? []} />
                <IncomeExpenseChart
                  incomeData={dashboard?.monthlyIncomeData ?? []}
                  expenseData={dashboard?.monthlyExpenseData ?? []}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
