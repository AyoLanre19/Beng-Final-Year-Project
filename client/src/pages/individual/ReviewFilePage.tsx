import { useEffect, useState } from "react";
import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";
import {
  calculateTaxPreview,
  downloadFilingPdf,
  submitTaxFiling,
  type TaxCalculationResult,
} from "../../services/filingService";
import "../../styles/review-file.css";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const currentTaxPeriod = () => {
  const today = new Date();
  const quarter = Math.floor(today.getMonth() / 3) + 1;
  return `Q${quarter} ${today.getFullYear()}`;
};

export default function ReviewFilePage() {
  const [checked, setChecked] = useState(false);
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [filingId, setFilingId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await calculateTaxPreview("individual");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load the filing summary.");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  const handleSubmit = async () => {
    if (!summary) {
      setError("No tax summary is available to submit.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const result = await submitTaxFiling({
        userType: "individual",
        taxPeriod: currentTaxPeriod(),
        totalIncome: summary.totalIncome,
        totalExpenses: summary.totalExpenses,
        totalTax: summary.totalTax,
        vatAmount: summary.vatAmount,
        withholdingAmount: summary.withholdingAmount,
        breakdown: summary.breakdown,
        filingData: {
          warnings: summary.warnings,
          lawReferences: summary.lawReferences,
        },
      });

      setFilingId(result.filingId);
      setMessage(`Forecast report saved successfully. Reference: ${result.referenceNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit filing right now.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownload = async () => {
    if (!filingId) {
      setError("Submit the filing first to generate the PDF.");
      return;
    }

    try {
      await downloadFilingPdf(filingId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download the PDF.");
    }
  };

  const paymentStatus = summary
    ? summary.underpayment > 0
      ? `Underpayment ${formatCurrency(summary.underpayment)}`
      : summary.overpayment > 0
        ? `Overpayment ${formatCurrency(summary.overpayment)}`
        : "Up to date"
    : "Loading...";

  return (
    <div className={`ind-page ${sidebarOpen ? "sidebar-open" : ""}`}>
      <IndividualSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ind-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="ind-content">
          <h1 className="page-h1">Tax Forecast Review</h1>
          <p className="page-sub">
            Review your projected tax position from the uploaded statement period. This draft should be checked against full-year records before any final filing.
          </p>

          {loading ? (
            <p className="page-sub">Loading filing summary...</p>
          ) : error ? (
            <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>
          ) : (
            <>
              <div className="rf-card">
                <h3 className="rf-title">Forecast Summary</h3>

                <div className="rf-row">
                  <span>Observed Statement Months</span>
                  <span>{summary?.monthsObserved ?? 0}</span>
                </div>

                <div className="rf-row">
                  <span>Observed Statement Income</span>
                  <span>{formatCurrency(summary?.observedPeriodIncome ?? 0)}</span>
                </div>

                <div className="rf-row">
                  <span>Projected Annual Tax</span>
                  <span>{formatCurrency(summary?.annualTaxForecast ?? 0)}</span>
                </div>

                <div className="rf-row">
                  <span>Estimated Monthly Tax</span>
                  <span>{formatCurrency(summary?.monthlyTaxEstimate ?? 0)}</span>
                </div>

                <div className="rf-row">
                  <span>Projected Annual Relief</span>
                  <span>{formatCurrency(summary?.reliefAmount ?? 0)}</span>
                </div>

                <div className="rf-row danger">
                  <span>Projected Tax Position</span>
                  <span>{paymentStatus}</span>
                </div>

                <p className="tax-muted">{summary?.projectionNote}</p>
              </div>

              <div className="rf-card">
                <label className="rf-checkbox">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <span>
                    I declare that the information provided is true and correct to the best of my knowledge.
                    I understand that providing false information may result in penalties.
                  </span>
                </label>
              </div>

              {message && <p className="page-sub" style={{ color: "#1b5e20" }}>{message}</p>}

              <div className="rf-actions">
                <button
                  className={`btn-primary ${!checked ? "disabled" : ""}`}
                  disabled={!checked || submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? "Saving..." : "Save Forecast"}
                </button>

                <button className="btn-outline" onClick={handleDownload}>
                  Download Forecast PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
