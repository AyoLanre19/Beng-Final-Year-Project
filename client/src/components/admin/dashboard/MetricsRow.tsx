import StatCard from "./StatCard";

export default function MetricsRow() {
  return (
    <div className="admin-metrics-grid">
      <StatCard title="Total Users" value="1,247" />
      <StatCard title="Filings Submitted" value="892" />
      <StatCard title="Total Tax Estimated" value="N124,500,000" />
      <StatCard title="AI Accuracy" value="94.2%" />
    </div>
  );
}
