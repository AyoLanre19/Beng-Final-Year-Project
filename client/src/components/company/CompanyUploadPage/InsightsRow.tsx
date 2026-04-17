export default function InsightsRow() {
  return (
    <div className="insights-row">

      <div className="insight-card glass">
        <p>Total Revenue</p>
        <h3>₦45,000,000</h3>
      </div>

      <div className="insight-card glass">
        <p>Payroll</p>
        <h3>₦12,000,000</h3>
      </div>

      <div className="insight-card glass">
        <p>Operating Expenses</p>
        <h3>₦16,000,000</h3>
      </div>

      <div className="insight-card glass">
        <p>Tax Detected</p>
        <h4>VAT ₦1,300,000</h4>
        <h4>Withholding ₦400,000</h4>
      </div>

    </div>
  );
}