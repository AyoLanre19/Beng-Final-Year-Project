import "../../styles/company-upload.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import UploadCard from "../../components/company/CompanyUploadPage/UploadSection";
import TransactionTable from "../../components/company/CompanyUploadPage/TransactionTable";
import InsightsRow from "../../components/company/CompanyUploadPage/InsightsRow";
import WarningsCard from "../../components/company/CompanyUploadPage/WarningsCard";
import ConfidenceCard from "../../components/company/CompanyUploadPage/ConfidenceCard";

export default function CompanyFinancialUpload() {
  return (
    <div className="company-layout">

      <CompanySidebar />

      <div className="company-main">
        <CompanyTopbar />

        <div className="company-content">
          <div className="company-page">

            <h2 className="page-title">Financial Data Upload</h2>
            <p className="page-sub">
              Upload bank statements, transactions, or accounting reports
            </p>

            <UploadCard />

            <TransactionTable />

            <InsightsRow />

            <div className="bottom-grid">
              <WarningsCard />
              <ConfidenceCard />
            </div>

            <div className="confirm-area">
              <button className="confirm-btn">⬆ Confirm Data</button>
              <p className="secure-text">
                🔒 Rest easy, your financial data is secure and encrypted.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}