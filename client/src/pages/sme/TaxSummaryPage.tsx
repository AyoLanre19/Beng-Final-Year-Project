import { useEffect, useState } from "react";
import "../../styles/sme-tax-summary.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import {
  calculateTaxPreview,
  type TaxCalculationResult,
} from "../../services/filingService";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function SmeTaxSummaryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await calculateTaxPreview("sme");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to calculate the SME tax forecast.");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const companyIncomeTax = summary
    ? Math.max(0, summary.totalTax - summary.vatAmount - summary.withholdingAmount)
    : 0;

  return (
    <div className={`sme-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SmeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sme-main">
        <SmeTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="sme-content">
          <div className="sme-tax-page">
            {loading ? (
              <p className="tax-sub">Loading SME tax forecast...</p>
            ) : error ? (
              <p className="tax-sub" style={{ color: "#c62828" }}>{error}</p>
            ) : summary ? (
              <>
                <div className="tax-hero glass">
                  <p className="tax-label">Projected Annual Tax</p>
                  <h1>{formatCurrency(summary.annualTaxForecast)}</h1>
                  <span>{summary.projectionNote}</span>
                </div>

                <h3 className="section-title">Forecast Breakdown</h3>

                <div className="tax-card glass">
                  <div className="tax-row">
                    <span>Projected Company Income Tax</span>
                    <strong>{formatCurrency(companyIncomeTax)}</strong>
                  </div>

                  <div className="tax-row">
                    <span>Projected VAT</span>
                    <strong>{formatCurrency(summary.vatAmount)}</strong>
                  </div>

                  <div className="tax-row">
                    <span>Projected Withholding Tax</span>
                    <strong>{formatCurrency(summary.withholdingAmount)}</strong>
                  </div>

                  <p className="tax-note">
                    Annualized from {summary.monthsObserved} month(s) of uploaded SME transactions.
                  </p>
                  <p className="tax-note">
                    Estimated monthly tax: {formatCurrency(summary.monthlyTaxEstimate)}.
                  </p>
                </div>

                <div className="tax-card glass">
                  <div className="tax-row">
                    <span>Observed Statement Revenue</span>
                    <strong>{formatCurrency(summary.observedPeriodIncome)}</strong>
                  </div>

                  <div className="tax-row">
                    <span>Projected Annual Revenue</span>
                    <strong>{formatCurrency(summary.totalIncome)}</strong>
                  </div>

                  <div className="tax-row">
                    <span>Projected Annual Expenses</span>
                    <strong>{formatCurrency(summary.totalExpenses)}</strong>
                  </div>

                  <div className="tax-row">
                    <span>Projected Annual Net Profit</span>
                    <strong>{formatCurrency(summary.netProfit)}</strong>
                  </div>

                  <div className="tax-divider" />

                  <p className="tax-sub">
                    Effective tax rate: {(summary.effectiveTaxRate * 100).toFixed(1)}%
                  </p>

                  {summary.warnings.map((warning) => (
                    <p className="tax-sub" key={warning}>
                      {warning}
                    </p>
                  ))}
                </div>

                <div className="tax-actions">
                  <button className="btn-primary">Review Forecast</button>
                  <button className="btn-secondary">Download Report</button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
