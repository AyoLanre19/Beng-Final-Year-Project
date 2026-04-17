export default function RiskCard() {
  const riskPercent = 65;

  return (
    <div className="risk-card glass">

      <div className="risk-left">
        <p>AI Risk Score</p>
        <h2>₦2,250,000</h2>
      </div>

      <div className="risk-ring">
        <div
          className="ring"
          style={{
            background: `conic-gradient(#f59e0b ${riskPercent}%, #e5e7eb 0)`
          }}
        >
          <div className="inner-ring">
            <span>Medium</span>
          </div>
        </div>
      </div>

    </div>
  );
}