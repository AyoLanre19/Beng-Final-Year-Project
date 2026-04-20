type RiskCardProps = {
  riskScore: number;
  estimatedTax: number;
};

const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

const getRiskLabel = (riskScore: number) => {
  if (riskScore >= 60) return "High";
  if (riskScore >= 30) return "Medium";
  return "Low";
};

export default function RiskCard({ riskScore, estimatedTax }: RiskCardProps) {
  return (
    <div className="risk-card glass">
      <div className="risk-left">
        <p>AI Risk Score</p>
        <h2>{formatCurrency(estimatedTax)}</h2>
      </div>

      <div className="risk-ring">
        <div
          className="ring"
          style={{
            background: `conic-gradient(#f59e0b ${riskScore}%, #e5e7eb 0)`,
          }}
        >
          <div className="inner-ring">
            <span>{getRiskLabel(riskScore)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
