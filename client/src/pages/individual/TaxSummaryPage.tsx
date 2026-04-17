import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";
import { calculateTaxPreview, type TaxCalculationResult } from "../../services/filingService";

import "../../styles/tax-summary.css";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

export default function TaxSummaryPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<TaxCalculationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="ind-page">
      <IndividualSidebar />

      <div className="ind-main">
        <Topbar />

        <div className="ind-content">
          <p className="breadcrumb">Dashboard &gt; Tax Summary</p>

          <h1 className="page-h1">Tax Summary</h1>

          <p className="page-sub">
            Here is a breakdown of your estimated tax based on your confirmed income data.
          </p>

          {loading ? (
            <p className="page-sub">Loading tax summary...</p>
          ) : error ? (
            <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>
          ) : summary ? (
            <>
              <div className="tax-card">
                <h3>Estimated Tax</h3>

                <div className="tax-big">{formatCurrency(summary.totalTax)}</div>

                <p className="muted">Based on confirmed transactions</p>
              </div>

              <div className="tax-card">
                <h3>Tax Breakdown</h3>

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
                  {summary.underpayment > 0 ? "Underpayment" : summary.overpayment > 0 ? "Overpayment" : "Status"}
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