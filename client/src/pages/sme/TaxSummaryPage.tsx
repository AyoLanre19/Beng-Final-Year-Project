import "../../styles/sme-tax-summary.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";

export default function SmeTaxSummaryPage() {
  return (
    <div className="sme-layout">

      <SmeSidebar />

      <div className="sme-main">
        <SmeTopbar />

        <div className="sme-content">

          <div className="sme-tax-page">

            {/* HERO */}
            <div className="tax-hero glass">
              <p className="tax-label">Total Estimated Tax</p>
              <h1>₦1,500,000</h1>
              <span>Based on confirmed transactions</span>
            </div>

            {/* BREAKDOWN */}
            <h3 className="section-title">Tax Breakdown</h3>

            <div className="tax-card glass">
              <div className="tax-row">
                <span>Corporate Income Tax</span>
                <strong>₦1,200,000</strong>
              </div>

              <div className="tax-row">
                <span>VAT</span>
                <strong>₦300,000</strong>
              </div>

              <p className="tax-note">
                Corporate tax is calculated on profits (Revenue ₦8.5M – Expenses ₦4.2M).
              </p>
              <p className="tax-note">
                VAT is calculated on sales/output VAT minus input VAT on expenses.
              </p>
            </div>

            {/* EXTRA INFO */}
            <div className="tax-card glass">

              <div className="tax-row">
                <span>Net Profit</span>
                <strong>₦4,300,000</strong>
              </div>

              <p className="tax-sub">
                (Revenue ₦8.5M – Expenses ₦4.2M)
              </p>

              <div className="tax-divider" />

              <p className="tax-sub">
                VAT Breakdown
              </p>

              <p className="tax-sub">
                Output VAT: ₦450,000 | Input VAT: -₦150,000
              </p>

            </div>

            {/* BUTTONS */}
            <div className="tax-actions">
              <button className="btn-primary">Review Filing</button>
              <button className="btn-secondary">Download Report</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}