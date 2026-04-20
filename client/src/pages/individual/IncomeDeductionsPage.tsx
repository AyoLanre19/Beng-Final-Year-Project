import { useState } from "react";
import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";

import UploadBox from "../../components/individual/IncomeDeduction/UploadBox";
import AIClassificationTable from "../../components/individual/IncomeDeduction/AIClassificationTable";
import SuggestedReliefs from "../../components/individual/IncomeDeduction/SuggestedReliefs";
import ValidationWarnings from "../../components/individual/IncomeDeduction/ValidationWarnings";
import AIConfidence from "../../components/individual/IncomeDeduction/AIConfidence";
import ConfidenceChart from "../../components/individual/IncomeDeduction/ConfidenceChart";
import {
  type UploadFinancialDataResult,
  type UploadPreviewTransaction,
} from "../../services/filingService";
import { usePortalUploadData } from "../../hooks/usePortalUploadData";
import { shortenStatementDescription } from "../../utils/statementText";
import "../../styles/income-deductions.css";

const fallbackTransactions: Array<{
  date: string;
  description: string;
  amount: string;
  category: string;
}> = [];

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

const buildCategorySegments = (transactions: UploadPreviewTransaction[]) => {
  const counts = new Map<string, number>();

  for (const transaction of transactions) {
    const key = transaction.category || "Needs review";
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return Array.from(counts.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 3)
    .map(([name, value]) => ({ name, value }));
};

const buildSuggestedReliefs = (transactions: UploadPreviewTransaction[]) => {
  const items: string[] = [];

  if (transactions.some((transaction) => transaction.category === "PAYE")) {
    items.push("PAYE deduction detected");
  }

  if (transactions.some((transaction) => transaction.category === "DeductibleExpense")) {
    items.push("Possible deductible expense detected");
  }

  if (
    transactions.some((transaction) =>
      transaction.description.toLowerCase().includes("pension")
    )
  ) {
    items.push("Pension-like payment found");
  }

  if (
    transactions.some((transaction) =>
      transaction.description.toLowerCase().includes("insurance")
    )
  ) {
    items.push("Insurance-like payment found");
  }

  return items.slice(0, 4);
};

export default function IncomeDeductionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    activeUpload,
    error,
    history,
    loading,
    selectDocument,
    handleUploaded,
  } = usePortalUploadData("individual");

  const uploadResult: UploadFinancialDataResult | null = activeUpload;
  const previewTransactions = uploadResult?.previewTransactions ?? [];
  const tableTransactions =
    previewTransactions.length > 0
      ? previewTransactions.map((transaction) => ({
          date: formatDate(transaction.transaction_date),
          description: shortenStatementDescription(transaction.description),
          amount: `${transaction.direction === "outflow" ? "-" : ""}NGN ${transaction.amount.toLocaleString("en-NG")}`,
          category: transaction.category || "Needs review",
        }))
      : fallbackTransactions;

  const confidenceValues = previewTransactions
    .map((transaction) => transaction.confidence)
    .filter((confidence): confidence is number => confidence !== null);

  const averageConfidence =
    confidenceValues.length > 0
      ? confidenceValues.reduce((sum, confidence) => sum + confidence, 0) /
        confidenceValues.length
      : null;

  return (
    <div className={`ind-page ${sidebarOpen ? "sidebar-open" : ""}`}>
      <IndividualSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ind-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="ind-content">
          <h1 className="page-h1">Income & Deductions</h1>

          <p className="page-sub">
            Upload your bank statement to detect income patterns, surface likely reliefs, and build a tax forecast from the statement period.
          </p>

          {error ? <p className="page-sub" style={{ color: "#c62828" }}>{error}</p> : null}
          {loading ? <p className="page-sub">Loading saved upload data...</p> : null}
          {uploadResult?.ai.status === "processing" ? (
            <p className="page-sub">
              AI is still taking time in the background, but the parsed rows, warnings, and relief hints below are already using your saved upload data.
            </p>
          ) : null}

          <UploadBox
            onUploaded={handleUploaded}
            result={uploadResult}
            history={history}
            activeDocumentId={uploadResult?.document?.id || null}
            onSelectDocument={selectDocument}
          />

          <AIClassificationTable transactions={tableTransactions} />

          <div className="grid-two">
            <SuggestedReliefs items={buildSuggestedReliefs(previewTransactions)} />
            <ValidationWarnings warnings={uploadResult?.warnings} />
          </div>

          <div className="grid-two">
            <AIConfidence
              averageConfidence={averageConfidence}
              aiStatus={uploadResult?.ai.status}
            />
            <ConfidenceChart
              averageConfidence={averageConfidence}
              segments={buildCategorySegments(previewTransactions)}
            />
          </div>

          <div className="confirm-wrapper">
            <button className="btn-confirm">Confirm Data</button>
          </div>
        </div>
      </div>
    </div>
  );
}
