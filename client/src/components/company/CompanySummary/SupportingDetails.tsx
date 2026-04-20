type Props = {
  netProfit: number;
  revenue: number;
  expenses: number;
  taxRate: number;
  monthlyTax: number;
  projectionNote: string;
  warnings: string[];
};

export default function SupportingDetails({
  netProfit,
  revenue,
  expenses,
  taxRate,
  monthlyTax,
  projectionNote,
  warnings,
}: Props) {
  return (
    <div className="supporting-grid">

      <div className="card glass">
        <h4>Projected Net Profit</h4>
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
        <h4>Estimated Monthly Tax</h4>
        <h2>₦{monthlyTax.toLocaleString()}</h2>
        <p>{projectionNote}</p>
      </div>

      <div className="card glass warning">
        <h4>Warnings</h4>
        <ul>
          {(warnings.length > 0 ? warnings : ["No additional warnings."]).map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>

    </div>
  );
}
