import { useEffect, useState } from "react";
import "../../styles/company-summary.css";
import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import TaxHero from "../../components/company/CompanySummary/TaxHero";
import TaxBreakdown from "../../components/company/CompanySummary/TaxBreakdown";
import SupportingDetails from "../../components/company/CompanySummary/SupportingDetails";
import ActionsBar from "../../components/company/CompanySummary/ActionsBar";
import {
  calculateTaxPreview,
  type TaxCalculationResult,
} from "../../services/filingService";

export default function CompanyTaxSummary() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await calculateTaxPreview("company");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to calculate the company tax forecast.");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const companyIncomeTax = summary
    ? Math.max(0, summary.totalTax - summary.vatAmount - summary.withholdingAmount)
    : 0;
  const projectionSubtitle = summary
    ? `Annualized from ${summary.monthsObserved} month(s) of uploaded company transactions`
    : "Annualized from your uploaded statement period";

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
            <h2 className="page-title">Company Tax Summary</h2>
            <p className="page-sub">
              This page shows a projected annual company tax outlook based on the statement period you uploaded.
            </p>

            {loading ? (
              <p className="page-sub">Loading company tax forecast...</p>
            ) : error ? (
              <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>
            ) : summary ? (
              <>
                <TaxHero
                  totalTax={summary.annualTaxForecast}
                  subtitle={projectionSubtitle}
                />

                <TaxBreakdown
                  corporate={companyIncomeTax}
                  vat={summary.vatAmount}
                  withholding={summary.withholdingAmount}
                />

                <SupportingDetails
                  netProfit={summary.netProfit}
                  revenue={summary.totalIncome}
                  expenses={summary.totalExpenses}
                  taxRate={Number((summary.effectiveTaxRate * 100).toFixed(1))}
                  monthlyTax={summary.monthlyTaxEstimate}
                  projectionNote={summary.projectionNote}
                  warnings={summary.warnings}
                />

                <ActionsBar />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
