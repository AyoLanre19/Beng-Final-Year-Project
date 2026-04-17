import AiMetricCard from "./AiMetricCard";

export default function AiMetricsRow() {
  return (
    <section className="ai-metrics-row">
      <AiMetricCard
        icon="▣"
        iconClass="green"
        title="Overall Accuracy"
        value="94.2%"
        subtitle="Correctly classified transactions"
      />

      <AiMetricCard
        icon="▤"
        iconClass="blue"
        title="Total Transactions Processed"
        value="1,234,567"
        subtitle="Lifetime transactions analyzed by AI"
      />

      <AiMetricCard
        icon="◉"
        iconClass="purple"
        title="Avg. Confidence Score"
        value="87.3%"
        subtitle="Average confidence across all classifications"
      />
    </section>
  );
}