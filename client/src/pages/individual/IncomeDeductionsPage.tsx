import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";

import UploadBox from "../../components/individual/IncomeDeduction/UploadBox";
import AIClassificationTable from "../../components/individual/IncomeDeduction/AIClassificationTable";
import SuggestedReliefs from "../../components/individual/IncomeDeduction/SuggestedReliefs";
import ValidationWarnings from "../../components/individual/IncomeDeduction/ValidationWarnings";
import AIConfidence from "../../components/individual/IncomeDeduction/AIConfidence";
import ConfidenceChart from "../../components/individual/IncomeDeduction/ConfidenceChart";

import { useNavigate } from "react-router-dom";
import "../../styles/income-deductions.css";

export default function IncomeDeductionsPage() {

  const transactions = [
    { date: "Jan 3, 2024", description: "Salary XYZ Ltd", amount: "₦300,000", category: "Salary" },
    { date: "Jan 5, 2024", description: "Transfer", amount: "₦50,000", category: "Transfer" },
    { date: "Jan 7, 2024", description: "POS Payment", amount: "-₦12,000", category: "Expense" },
    { date: "Jan 12, 2024", description: "Consulting Fee", amount: "₦150,000", category: "Freelance" },
    { date: "Jan 15, 2024", description: "Cash Deposit", amount: "₦100,000", category: "Other" }
  ];

  // Function to handle Topbar profile action
  function handleOpenProfile() {
    console.log("Profile opened");
    // You can replace this with actual navigation/modal logic
  }

  return (
    <div className="ind-page">

      <IndividualSidebar />

      <div className="ind-main">

        {/* Pass required prop to Topbar */}
        <Topbar onOpenProfile={handleOpenProfile} />

        <div className="ind-content">

          <h1 className="page-h1">Income & Deductions</h1>

          <p className="page-sub">
            Upload your bank statement to automatically detect income sources and claim eligible tax reliefs.
          </p>

          <UploadBox />

          <AIClassificationTable transactions={transactions} />

          {/* FIRST ROW */}
          <div className="grid-two">
            <SuggestedReliefs />
            <ValidationWarnings />
          </div>

          {/* SECOND ROW */}
          <div className="grid-two">
            <AIConfidence />
            <ConfidenceChart />
          </div>

          {/* Confirm Button */}
          <div className="confirm-wrapper">
            <button className="btn-confirm">
              Confirm Data
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}