import StatCard from "./StatCard";

export default function MetricsRow() {
  return (
    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      <StatCard title="Total Users" value="1,247" />
      <StatCard title="Filings Submitted" value="892" />
      <StatCard title="Total Tax Estimated" value="₦124,500,000" />
      <StatCard title="AI Accuracy" value="94.2%" />
    </div>
  );
}