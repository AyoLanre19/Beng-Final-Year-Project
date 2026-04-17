type AiMetricCardProps = {
  icon: string;
  iconClass: string;
  title: string;
  value: string;
  subtitle: string;
};

export default function AiMetricCard({
  icon,
  iconClass,
  title,
  value,
  subtitle,
}: AiMetricCardProps) {
  return (
    <div className="ai-metric-card">
      <div className={`ai-metric-icon ${iconClass}`}>{icon}</div>

      <div className="ai-metric-content">
        <p className="ai-metric-title">{title}</p>
        <h3 className="ai-metric-value">{value}</h3>
        <span className="ai-metric-subtitle">{subtitle}</span>
      </div>
    </div>
  );
}