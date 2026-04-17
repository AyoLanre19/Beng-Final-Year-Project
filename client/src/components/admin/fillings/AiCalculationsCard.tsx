const incomeSummary = [
  { item: "Total Income/Revenue", amount: "₦3,200,000" },
  { item: "Total Expenses", amount: "₦28,000,000" },
  { item: "Net Profit", amount: "₦17,000,000" },
];

const taxBreakdown = [
  { type: "Salary/Corporate Tax", amount: "₦260,000" },
  { type: "Other Income Tax", amount: "₦50,000" },
  { type: "VAT", amount: "₦1,300,000" },
  { type: "Withholding Tax", amount: "₦400,000" },
];

export default function AiCalculationsCard() {
  return (
    <section className="filing-card ai-calculations-card">
      <div className="filing-card-title">
        <span className="filing-card-icon">✣</span>
        <h3>AI Calculations</h3>
      </div>

      <div className="ai-card-content">
        <div className="ai-tables-column">
          <div className="mini-table-block">
            <h4>Income/Revenue Summary</h4>

            <table className="filing-mini-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {incomeSummary.map((row) => (
                  <tr key={row.item}>
                    <td>{row.item}</td>
                    <td>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mini-table-block">
            <h4>Tax Breakdown</h4>

            <table className="filing-mini-table">
              <thead>
                <tr>
                  <th>Tax Type</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {taxBreakdown.map((row) => (
                  <tr key={row.type}>
                    <td>{row.type}</td>
                    <td>{row.amount}</td>
                  </tr>
                ))}

                <tr className="total-tax-row">
                  <td>TOTAL TAX DUE</td>
                  <td>₦310,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <aside className="ai-side-panel">
          <div className="confidence-box">
            <h4>AI Confidence Score</h4>

            <div className="confidence-circle-wrap">
              <div className="confidence-circle">
                <span>87%</span>
              </div>

              <div className="confidence-number">87%</div>
            </div>
          </div>

          <div className="risk-box">
            <h4>Risk Score</h4>
            <span className="risk-badge low">Low</span>
          </div>

          <div className="flags-box">
            <h4>Flags</h4>

            <div className="flag-alert">⚠ Possible unreported income</div>
            <div className="flag-alert">⚠ Unusual expense pattern</div>
          </div>
        </aside>
      </div>
    </section>
  );
}