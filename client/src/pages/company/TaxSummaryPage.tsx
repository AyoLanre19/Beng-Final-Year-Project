import "../../styles/company-summary.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import TaxHero from "../../components/company/CompanySummary/TaxHero";
import TaxBreakdown from "../../components/company/CompanySummary/TaxBreakdown";
import SupportingDetails from "../../components/company/CompanySummary/SupportingDetails";
import ActionsBar from "../../components/company/CompanySummary/ActionsBar";

export default function CompanyTaxSummary() {
  // ✅ TEMP FRONTEND DATA (since no backend yet)
  const data = {
    totalTax: 5900000,
    corporate: 4200000,
    vat: 1300000,
    withholding: 400000,
    netProfit: 17000000,
    revenue: 45000000,
    expenses: 28000000,
    taxRate: 24.7,
    outputVAT: 2250000,
    inputVAT: 950000,
  };

  return (
    <div className="company-layout">
      <CompanySidebar />

      <div className="company-main">
        <CompanyTopbar />

        <div className="company-content">
          <div className="company-page">
            <h2 className="page-title">Company Tax Summary</h2>
            <p className="page-sub">
              Detailed breakdown of your estimated tax liability
            </p>

            <TaxHero totalTax={data.totalTax} />

            <TaxBreakdown
              corporate={data.corporate}
              vat={data.vat}
              withholding={data.withholding}
            />

            <SupportingDetails
              netProfit={data.netProfit}
              revenue={data.revenue}
              expenses={data.expenses}
              taxRate={data.taxRate}
              outputVAT={data.outputVAT}
              inputVAT={data.inputVAT}
            />

            <ActionsBar />
          </div>
        </div>
      </div>
    </div>
  );
}