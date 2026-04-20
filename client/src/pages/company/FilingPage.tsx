import { useEffect, useState } from "react";
import "../../styles/company-filing.css";

import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";
import {
  calculateTaxPreview,
  downloadFilingPdf,
  submitTaxFiling,
  type TaxCalculationResult,
} from "../../services/filingService";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const currentTaxPeriod = () => {
  const today = new Date();
  const quarter = Math.floor(today.getMonth() / 3) + 1;
  return `Q${quarter} ${today.getFullYear()}`;
};

export default function CompanyFiling() {
  const [accepted, setAccepted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filingId, setFilingId] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await calculateTaxPreview("company");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load company filing data.");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const handleSubmit = async () => {
    if (!summary) {
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const result = await submitTaxFiling({
        userType: "company",
        taxPeriod: currentTaxPeriod(),
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        totalTax: summary.totalTax,
        vatAmount: summary.vatAmount,
        withholdingAmount: summary.withholdingAmount,
        breakdown: summary.breakdown,
        filingData: {
          projectionNote: summary.projectionNote,
          warnings: summary.warnings,
        },
      });

      setFilingId(result.filingId);
      setMessage(`Company forecast saved successfully. Reference: ${result.referenceNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save company forecast.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!filingId) {
      setError("Save the forecast first to generate the PDF.");
      return;
    }

    try {
      await downloadFilingPdf(filingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download the PDF.");
    }
  };

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
            <h2 className="page-title">Company Filing Review</h2>
            <p className="page-sub">
              Review the projected annual company tax position based on saved uploads before any final filing decision.
            </p>

            {error ? <p className="page-sub" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="page-sub">Loading company forecast...</p>
            ) : summary ? (
              <>
                <div className="filing-card glass">
                  <div className="summary-row">
                    <span>Observed Statement Revenue</span>
                    <strong>{formatCurrency(summary.observedPeriodIncome)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Projected Annual Tax</span>
                    <strong>{formatCurrency(summary.annualTaxForecast)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Monthly Tax</span>
                    <strong>{formatCurrency(summary.monthlyTaxEstimate)}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Projected VAT</span>
                    <strong>{formatCurrency(summary.vatAmount)}</strong>
                  </div>
                  <p className="small-note">{summary.projectionNote}</p>
                </div>

                <div className="filing-card glass">
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={accepted}
                      onChange={() => setAccepted(!accepted)}
                    />
                    <span>
                      I understand this is a forecast from uploaded statement data and should be reviewed against full-year company records.
                    </span>
                  </label>
                </div>

                {message ? <p className="page-sub" style={{ color: "#1b5e20" }}>{message}</p> : null}

                <div className="success-actions">
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={!accepted || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Saving..." : "Save Forecast"}
                  </button>

                  <button
                    type="button"
                    className="secondary-btn"
                    onClick={handleDownload}
                  >
                    Download Forecast PDF
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
