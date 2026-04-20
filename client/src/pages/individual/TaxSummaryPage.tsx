import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";
import { calculateTaxPreview, type TaxCalculationResult } from "../../services/filingService";

import "../../styles/tax-summary.css";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;
const formatPeriod = (start: string | null, end: string | null) => {
  if (!start && !end) {
    return "uploaded statements";
  }

  if (start && end && start !== end) {
    return `${start} to ${end}`;
  }

  return start || end || "uploaded statements";
};

export default function TaxSummaryPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoading(true);
        const data = await calculateTaxPreview("individual");
        setSummary(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to calculate tax summary.");
      } finally {
        setLoading(false);
      }
    };

    void loadSummary();
  }, []);

  return (
    <div className={`ind-page ${sidebarOpen ? "sidebar-open" : ""}`}>
      <IndividualSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="ind-main">
        <Topbar
          onToggleSidebar={() => setSidebarOpen((open) => !open)}
          isSidebarOpen={sidebarOpen}
        />

        <div className="ind-content">
          <p className="breadcrumb">Dashboard &gt; Tax Summary</p>

          <h1 className="page-h1">Tax Summary</h1>

          <p className="page-sub">
            Here is your projected annual tax outlook based on the statement period you uploaded, not a final filing answer from one month alone.
          </p>

          {loading ? (
            <p className="page-sub">Loading tax summary...</p>
          ) : error ? (
            <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>
          ) : summary ? (
            <>
              <div className="tax-card">
                <h3>Projected Annual Tax</h3>

                <div className="tax-big">{formatCurrency(summary.annualTaxForecast)}</div>

                <p className="muted">
                  Annualized from {summary.monthsObserved} month(s) of transactions in {formatPeriod(summary.periodStart, summary.periodEnd)}
                </p>
              </div>

              <div className="tax-card">
                <h3>Estimated Monthly Tax</h3>

                <div className="tax-big">{formatCurrency(summary.monthlyTaxEstimate)}</div>

                <p className="muted">{summary.projectionNote}</p>
              </div>

              <div className="tax-card">
                <h3>Forecast Breakdown</h3>

                <table className="tax-table">
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    {summary.breakdown.map((item) => (
                      <tr key={item.label}>
                        <td>
                          <strong>{item.label}</strong>
                          {item.basis && <div className="tax-muted">{item.basis}</div>}
                          {item.note && <div className="tax-muted">{item.note}</div>}
                        </td>
                        <td>{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="tax-card under-card">
                <h3 className="tax-card-title">
                  {summary.underpayment > 0 ? "Projected Underpayment" : summary.overpayment > 0 ? "Projected Overpayment" : "Projected Status"}
                </h3>

                <div className="tax-under">
                  {formatCurrency(summary.underpayment > 0 ? summary.underpayment : summary.overpayment)}
                </div>

                <p className="tax-muted">
                  Effective tax rate: {(summary.effectiveTaxRate * 100).toFixed(1)}%
                </p>
              </div>

              {summary.warnings.length > 0 && (
                <div className="tax-card">
                  <h3>Warnings</h3>
                  <ul>
                    {summary.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="tax-card">
                <h3>Law References</h3>
                <ul>
                  {summary.lawReferences.map((reference) => (
                    <li key={reference}>{reference}</li>
                  ))}
                </ul>
              </div>

              <div className="tax-actions">
                <button className="btn-primary" onClick={() => navigate("/individual/review-file")}>
                  Review Filing
                </button>

                <button className="btn-outline" onClick={() => window.location.reload()}>
                  Refresh Estimate
                </button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
