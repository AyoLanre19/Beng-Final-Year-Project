type Props = {
  netProfit: number;
  revenue: number;
  expenses: number;
  taxRate: number;
  outputVAT: number;
  inputVAT: number;
};

export default function SupportingDetails({
  netProfit,
  revenue,
  expenses,
  taxRate,
  outputVAT,
  inputVAT,
}: Props) {
  return (
    <div className="supporting-grid">

      <div className="card glass">
        <h4>Net Profit</h4>
        <h2>₦{netProfit.toLocaleString()}</h2>
        <p>
          Revenue ₦{revenue.toLocaleString()} • Expenses ₦{expenses.toLocaleString()}
        </p>
      </div>

      <div className="card glass">
        <h4>Effective Tax Rate</h4>
        <h2>{taxRate}%</h2>
      </div>

      <div className="card glass">
        <h4>VAT Breakdown</h4>
        <p>Output VAT: ₦{outputVAT.toLocaleString()}</p>
        <p>Input VAT: -₦{inputVAT.toLocaleString()}</p>
      </div>

      <div className="card glass warning">
        <h4>Warnings</h4>
        <ul>
          <li>⚠ Large unreconciled transfer</li>
          <li>⚠ Possible period mismatch</li>
          <li>⚠ WHT inconsistency</li>
        </ul>
      </div>

    </div>
  );
}