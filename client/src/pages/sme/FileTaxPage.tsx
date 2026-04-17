import "../../styles/sme-file-tax.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import { useState } from "react";

export default function SmeFileTaxPage() {

  const [checked, setChecked] = useState(false);

  return (
    <div className="sme-layout">

      <SmeSidebar />

      <div className="sme-main">
        <SmeTopbar />

        <div className="sme-content">

          <div className="sme-file-page">

            <h2 className="page-title">File SME Tax</h2>

            {/* SUMMARY */}
            <h3 className="section-title">Filing Summary</h3>

            <div className="file-card glass">

              <div className="file-row header">
                <span>Filing for: Q1 2024</span>
              </div>

              <div className="file-row">
                <span>Total Revenue Detected</span>
                <strong>₦8,500,000</strong>
              </div>

              <div className="file-row">
                <span>Total Expenses</span>
                <strong>₦4,200,000</strong>
              </div>

              <div className="file-row">
                <span>Net Profit</span>
                <strong>₦4,300,000</strong>
              </div>

              <div className="divider" />

              <div className="file-row">
                <span>Total Tax Due</span>
                <strong>₦1,500,000</strong>
              </div>

              <div className="sub-tax">
                • Corporate Tax ₦1,200,000
              </div>
              <div className="sub-tax">
                • VAT ₦300,000
              </div>

            </div>

            {/* DECLARATION */}
            <h3 className="section-title">Declaration & Consent</h3>

            <div className="file-card glass declaration">

              <label className="checkbox-wrap">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />

                <span>
                  I declare that the information provided is true and correct
                  to the best of my knowledge. I understand that providing false
                  information may result in penalties for the business.
                </span>
              </label>

            </div>

            {/* ACTIONS */}
            <div className="file-actions">
              <button
                className={`btn-primary ${!checked ? "disabled" : ""}`}
                disabled={!checked}
              >
                Submit Filing
              </button>

              <button className="btn-secondary">
                Download Report
              </button>
            </div>

            <p className="footer-note">
              Rest easy, your business data is secure and encrypted.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}