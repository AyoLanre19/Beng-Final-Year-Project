import "../../styles/company-dashboard.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import MetricsRow from "../../components/company/CompanyDashboard/MetricsRow";
import RiskCard from "../../components/company/CompanyDashboard/RiskCard";
import RevenueChart from "../../components/company/CompanyDashboard/RevenueChart";
import ExpenseChart from "../../components/company/CompanyDashboard/ExpenseChart";

export default function CompanyDashboard() {
  return (
    <div className="company-layout">

      <CompanySidebar />

      <div className="company-main">
        <CompanyTopbar />

        <div className="company-content">

          <div className="company-page">

            {/* HEADER */}
            <div className="dashboard-header">
              <h2>Dashboard</h2>
            </div>

            {/* METRICS */}
            <MetricsRow />

            {/* RISK */}
            <RiskCard />

            {/* CHARTS */}
            <div className="charts-grid">
              <RevenueChart />
              <ExpenseChart />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}