type MetricsRowProps = {
  totalRevenue: number;
  totalExpenses: number;
  estimatedTax: number;
  vatEstimate: number;
};

const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export default function MetricsRow({
  totalRevenue,
  totalExpenses,
  estimatedTax,
  vatEstimate,
}: MetricsRowProps) {
  return (
    <div className="metrics-grid">
      <div className="metric-card glass">
        <p>Total Revenue Detected</p>
        <h3>{formatCurrency(totalRevenue)}</h3>
      </div>

      <div className="metric-card glass">
        <p>Total Expenses Detected</p>
        <h3>{formatCurrency(totalExpenses)}</h3>
      </div>

      <div className="metric-card glass">
        <p>Corporate Tax Estimate</p>
        <h3>{formatCurrency(Math.max(0, estimatedTax - vatEstimate))}</h3>
      </div>

      <div className="metric-card glass">
        <p>VAT Liability</p>
        <h3>{formatCurrency(vatEstimate)}</h3>
      </div>
    </div>
  );
}
