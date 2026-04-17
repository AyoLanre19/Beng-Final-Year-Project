export default function FilingSummary() {
  return (
    <div className="filing-card glass">

      <h3>Filing Summary</h3>

      <div className="section">
        <h4>Company Details</h4>
        <p>ABC Nigeria Ltd</p>
        <p>12345678-9000</p>
        <p>Financial Year Ending Dec 31, 2024</p>
      </div>

      <div className="grid-2">

        <div>
          <h4>Financial Summary</h4>
          <p>Revenue: ₦45,000,000</p>
          <p>Expenses: ₦28,000,000</p>
          <p><strong>Net Profit: ₦17,000,000</strong></p>
        </div>

        <div>
          <h4>Tax Summary</h4>
          <p>Corporate Tax: ₦4,200,000</p>
          <p>VAT: ₦1,300,000</p>
          <p>WHT: ₦400,000</p>
          <p className="total">TOTAL: ₦5,900,000</p>
        </div>

      </div>
    </div>
  );
}