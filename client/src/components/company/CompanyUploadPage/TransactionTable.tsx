import type { UploadPreviewTransaction } from "../../../services/filingService";
import { shortenStatementDescription } from "../../../utils/statementText";

type TransactionTableProps = {
  transactions?: UploadPreviewTransaction[];
};

const fallbackRows: string[][] = [];

const formatDate = (value: string | null): string => {
  if (!value) {
    return "No date";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-NG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount: number, direction: "inflow" | "outflow"): string => {
  const prefix = direction === "outflow" ? "-" : "";
  return `${prefix}NGN ${Math.abs(amount).toLocaleString("en-NG")}`;
};

export default function TransactionTable({
  transactions,
}: TransactionTableProps) {
  const rows =
    transactions && transactions.length > 0
      ? transactions.map((transaction) => [
          formatDate(transaction.transaction_date),
          shortenStatementDescription(transaction.description),
          formatAmount(transaction.amount, transaction.direction),
          transaction.category || "Needs review",
        ])
      : fallbackRows;

  return (
    <div className="table-card glass">
      <h4>Parsed Statement Preview</h4>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Detected Category</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((row) => (
              <tr key={`${row[0]}-${row[1]}-${row[2]}`}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td className={row[2].startsWith("-") ? "neg" : "pos"}>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No parsed company statement selected yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
