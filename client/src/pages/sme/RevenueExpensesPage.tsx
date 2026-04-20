import { useState } from "react";
import "../../styles/sme-revenue-expenses.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import StatementUploadCard from "../../components/uploads/StatementUploadCard";
import type {
  UploadPreviewTransaction,
} from "../../services/filingService";
import { usePortalUploadData } from "../../hooks/usePortalUploadData";
import { shortenStatementDescription } from "../../utils/statementText";

type TableRow = {
  date: string;
  description: string;
  amount: number;
  category: string;
};

const fallbackTransactions: TableRow[] = [];

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

const formatCurrency = (value: number): string =>
  `NGN ${Math.abs(value).toLocaleString("en-NG")}`;

const buildTableRows = (transactions: UploadPreviewTransaction[]): TableRow[] => {
  return transactions.map((transaction) => ({
    date: formatDate(transaction.transaction_date),
    description: shortenStatementDescription(transaction.description),
    amount: transaction.direction === "outflow" ? -transaction.amount : transaction.amount,
    category: transaction.category || "Needs review",
  }));
};

export default function RevenueExpensesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    activeUpload: uploadResult,
    error,
    history,
    loading,
    selectDocument,
    handleUploaded,
  } = usePortalUploadData("sme");

  const liveTransactions = uploadResult?.previewTransactions ?? [];
  const tableRows = liveTransactions.length > 0 ? buildTableRows(liveTransactions) : fallbackTransactions;
  const warnings = uploadResult?.warnings.length
    ? uploadResult.warnings
    : ["No validation warnings yet."];

  const totalRevenue = tableRows
    .filter((transaction) => transaction.amount > 0)
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = tableRows
    .filter((transaction) => transaction.amount < 0)
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const taxIndicators = tableRows
    .filter((transaction) =>
      ["TaxPayment", "VAT", "WithholdingTax", "CorporateTax"].includes(transaction.category)
    )
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  return (
    <div className={`sme-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SmeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sme-main">
        <SmeTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="sme-content">
          <div className="sme-re-page">
            <h2 className="sme-title">Revenue & Expense Analysis</h2>
            <p className="sme-sub">
              Upload business bank statements and let the backend parse them into revenue and expense transactions.
            </p>

            {error ? <p className="sme-sub" style={{ color: "#c62828" }}>{error}</p> : null}
            {loading ? <p className="sme-sub">Loading saved upload data...</p> : null}
            {uploadResult?.ai.status === "processing" ? (
              <p className="sme-sub">
                AI is still working in the background, but the uploaded SME data below is already live from your saved statement.
              </p>
            ) : null}

            <StatementUploadCard
              title="Upload SME Bank Statement"
              subtitle="Use PDF, CSV, Excel, or a statement screenshot. The parsed data will be saved to the SME account and sent to the AI classifier."
              badge="SME Portal"
              onUploaded={handleUploaded}
              result={uploadResult}
              history={history}
              activeDocumentId={uploadResult?.document?.id || null}
              onSelectDocument={selectDocument}
            />

            <h3 className="section-title">Parsed Statement Preview</h3>

            <div className="table-wrapper glass">
              <table className="sme-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="right">Amount</th>
                    <th>Detected Category</th>
                  </tr>
                </thead>

                <tbody>
                  {tableRows.length > 0 ? (
                    tableRows.map((transaction) => (
                      <tr key={`${transaction.date}-${transaction.description}-${transaction.amount}`}>
                        <td>{transaction.date}</td>
                        <td>{transaction.description}</td>
                        <td className={`right ${transaction.amount < 0 ? "neg" : "pos"}`}>
                          {transaction.amount < 0 ? "-" : ""}
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>{transaction.category}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>No parsed SME statement selected yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="insight-grid">
              <div className="card glass">
                <p>Total Revenue</p>
                <h2>{formatCurrency(totalRevenue)}</h2>
              </div>

              <div className="card glass">
                <p>Total Expenses</p>
                <h2>{formatCurrency(totalExpenses)}</h2>
              </div>

              <div className="card glass">
                <p>Tax Indicators</p>
                <h2>{formatCurrency(taxIndicators)}</h2>
              </div>

              <div className="card warning glass">
                <p>Warnings</p>
                <ul>
                  {warnings.map((warning) => (
                    <li key={warning}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="confirm-wrap">
              <button className="confirm-btn">Confirm Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
