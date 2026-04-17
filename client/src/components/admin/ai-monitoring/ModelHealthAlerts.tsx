export default function ModelHealthAlerts() {
  return (
    <section className="ai-monitor-card alerts-card">
      <h3 className="ai-card-heading">Model Health Alerts</h3>

      <div className="alert-stack">
        <div className="health-alert warning">
          ⚠ Accuracy dropped 2% in last 7 days
        </div>

        <div className="health-alert warning">
          ⚠ High error rate for "Other Income" category
        </div>

        <div className="health-alert info">
          ℹ New training data available for download
        </div>
      </div>

      <button type="button" className="view-data-btn">
        View Data
      </button>
    </section>
  );
}