import "../../styles/sme-file-tax.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import { useEffect, useState } from "react";
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

export default function SmeFileTaxPage() {
  const [checked, setChecked] = useState(false);
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
        const data = await calculateTaxPreview("sme");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load SME filing data.");
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
        userType: "sme",
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
      setMessage(`SME forecast saved successfully. Reference: ${result.referenceNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save SME forecast.");
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
    <div className={`sme-layout ${sidebarOpen ? "sidebar-open" : ""}`}>
      <SmeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="sme-main">
        <SmeTopbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="sme-content">
          <div className="sme-file-page">
            <h2 className="page-title">SME Tax Forecast Review</h2>

            {error ? <p className="footer-note" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="footer-note">Loading SME forecast...</p>
            ) : summary ? (
              <>
                <h3 className="section-title">Forecast Summary</h3>

                <div className="file-card glass">
                  <div className="file-row header">
                    <span>Forecast for: {currentTaxPeriod()}</span>
                  </div>

                  <div className="file-row">
                    <span>Observed Statement Revenue</span>
                    <strong>{formatCurrency(summary.observedPeriodIncome)}</strong>
                  </div>

                  <div className="file-row">
                    <span>Projected Annual Revenue</span>
                    <strong>{formatCurrency(summary.totalIncome)}</strong>
                  </div>

                  <div className="file-row">
                    <span>Projected Annual Expenses</span>
                    <strong>{formatCurrency(summary.totalExpenses)}</strong>
                  </div>

                  <div className="file-row">
                    <span>Projected Annual Tax</span>
                    <strong>{formatCurrency(summary.annualTaxForecast)}</strong>
                  </div>

                  <div className="sub-tax">
                    Estimated monthly tax {formatCurrency(summary.monthlyTaxEstimate)}
                  </div>
                  <div className="sub-tax">
                    {summary.projectionNote}
                  </div>
                </div>

                <h3 className="section-title">Declaration & Consent</h3>

                <div className="file-card glass declaration">
                  <label className="checkbox-wrap">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />

                    <span>
                      I understand this is a forecast from uploaded SME statement data and should be verified against the full business records.
                    </span>
                  </label>
                </div>

                {message ? <p className="footer-note" style={{ color: "#1b5e20" }}>{message}</p> : null}

                <div className="file-actions">
                  <button
                    className={`btn-primary ${!checked ? "disabled" : ""}`}
                    disabled={!checked || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? "Saving..." : "Save Forecast"}
                  </button>

                  <button className="btn-secondary" onClick={handleDownload}>
                    Download Report
                  </button>
                </div>
              </>
            ) : null}

            <p className="footer-note">
              Rest easy, your business data is secure and encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
