import DashboardLayout from "../../../components/layout/IndividualDashboardLayout";
import MetricCard from "../../../components/individual/MetricCard";
import "../../../styles/individual-dashboard.css";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="title">Dashboard</h1>

      <p className="welcome">Welcome back, Ifeanyi!</p>

      <div className="metrics-row">
        <MetricCard title="Total Income Detected" subtitle="Bank Statements">
          ₦2,150,000
        </MetricCard>

        <MetricCard title="Estimated Tax" subtitle="AI Estimated">
          ₦310,000
        </MetricCard>

        <MetricCard title="Overpayment / Underpayment">
          No issue detected
        </MetricCard>

        <MetricCard title="AI Risk Score" subtitle="Low Risk">
          8%
        </MetricCard>
      </div>
    </DashboardLayout>
  );
}