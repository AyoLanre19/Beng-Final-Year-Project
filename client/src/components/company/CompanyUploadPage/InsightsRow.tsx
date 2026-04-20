import type { UploadPreviewTransaction } from "../../../services/filingService";

type InsightsRowProps = {
  transactions?: UploadPreviewTransaction[];
};

const formatCurrency = (value: number): string =>
  `NGN ${Math.round(value).toLocaleString("en-NG")}`;

export default function InsightsRow({ transactions }: InsightsRowProps) {
  const hasLiveData = Boolean(transactions && transactions.length > 0);
  const rows = transactions ?? [];

  const totalRevenue = hasLiveData
    ? rows
        .filter((transaction) => transaction.direction === "inflow")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;

  const payroll = hasLiveData
    ? rows
        .filter((transaction) => transaction.category === "Payroll")
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;

  const operatingExpenses = hasLiveData
    ? rows
        .filter(
          (transaction) =>
            transaction.direction === "outflow" &&
            transaction.category !== "Payroll" &&
            transaction.category !== "VAT" &&
            transaction.category !== "WithholdingTax" &&
            transaction.category !== "CorporateTax" &&
            transaction.category !== "TaxPayment"
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;

  const taxDetected = hasLiveData
    ? rows
        .filter((transaction) =>
          ["VAT", "WithholdingTax", "CorporateTax", "TaxPayment"].includes(
            transaction.category || ""
          )
        )
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;

  return (
    <div className="insights-row">
      <div className="insight-card glass">
        <p>Total Revenue</p>
        <h3>{formatCurrency(totalRevenue)}</h3>
      </div>

      <div className="insight-card glass">
        <p>Payroll</p>
        <h3>{formatCurrency(payroll)}</h3>
      </div>

      <div className="insight-card glass">
        <p>Operating Expenses</p>
        <h3>{formatCurrency(operatingExpenses)}</h3>
      </div>

      <div className="insight-card glass">
        <p>Tax Detected</p>
        <h4>{formatCurrency(taxDetected)}</h4>
        <h4>{hasLiveData ? "From uploaded transactions" : "No statement selected yet"}</h4>
      </div>
    </div>
  );
}
