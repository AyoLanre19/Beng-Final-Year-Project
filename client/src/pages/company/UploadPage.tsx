import { useState } from "react";
import "../../styles/company-upload.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import UploadCard from "../../components/company/CompanyUploadPage/UploadSection";
import TransactionTable from "../../components/company/CompanyUploadPage/TransactionTable";
import InsightsRow from "../../components/company/CompanyUploadPage/InsightsRow";
import WarningsCard from "../../components/company/CompanyUploadPage/WarningsCard";
import ConfidenceCard from "../../components/company/CompanyUploadPage/ConfidenceCard";
import { usePortalUploadData } from "../../hooks/usePortalUploadData";

export default function CompanyFinancialUpload() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    activeUpload: uploadResult,
    error,
    history,
    loading,
    selectDocument,
    handleUploaded,
  } = usePortalUploadData("company");

  return (
    <div className={`company-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <CompanySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="company-main">
        <CompanyTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="company-content">
          <div className="company-page">
            <h2 className="page-title">Financial Data Upload</h2>
            <p className="page-sub">
              Upload bank statements, transactions, or accounting reports
            </p>

            {error ? <p className="page-sub" style={{ color: "#c62828" }}>{error}</p> : null}
            {loading ? <p className="page-sub">Loading saved upload data...</p> : null}
            {uploadResult?.ai.status === "processing" ? (
              <p className="page-sub">
                AI is still refining company classifications, but the parsed figures below are already available from your saved upload.
              </p>
            ) : null}

            <UploadCard
              onUploaded={handleUploaded}
              result={uploadResult}
              history={history}
              activeDocumentId={uploadResult?.document?.id || null}
              onSelectDocument={selectDocument}
            />

            <TransactionTable transactions={uploadResult?.previewTransactions} />

            <InsightsRow transactions={uploadResult?.previewTransactions} />

            <div className="bottom-grid">
              <WarningsCard warnings={uploadResult?.warnings} />
              <ConfidenceCard
                transactions={uploadResult?.previewTransactions}
                aiStatus={uploadResult?.ai.status}
              />
            </div>

            <div className="confirm-area">
              <button className="confirm-btn">Confirm Data</button>
              <p className="secure-text">
                Your company financial data stays tied to this company account.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
