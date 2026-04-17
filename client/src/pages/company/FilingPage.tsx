import { useState } from "react";
import "../../styles/company-filing.css";

import CompanySidebar from "../../components/company/CompanySidebar";
import CompanyTopbar from "../../components/company/CompanyTopbar";

import FilingSummary from "../../components/company/CompanyFilling/FilingSummary";
import DeclarationSection from "../../components/company/CompanyFilling/DeclarationSection";
import SubmitSection from "../../components/company/CompanyFilling/SubmitSection";

export default function CompanyFiling() {
  const [accepted, setAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="company-layout">
      <CompanySidebar />

      <div className="company-main">
        <CompanyTopbar />

        <div className="company-content">
          <div className="company-page">

            <h2 className="page-title">Corporate Filing</h2>
            <p className="page-sub">
              Final step: review and submit your return
            </p>

            <div className="filing-card glass">
              <FilingSummary />
            </div>

            {!submitted && (
              <>
                <DeclarationSection
                  accepted={accepted}
                  setAccepted={setAccepted}
                />

                <SubmitSection
                  accepted={accepted}
                  onSubmit={() => setSubmitted(true)}
                />
              </>
            )}

            {submitted && (
              <div className="success-panel glass">
                <div className="success-icon">✔</div>

                <h2>Corporate Filing Submitted Successfully!</h2>

                <p>Your corporate tax return has been received.</p>

                <div className="ref-box">
                  CORP-2024-0425-001
                </div>

                <div className="success-actions">
                  <button className="primary-btn">
                    Download Filing PDF
                  </button>

                  <button className="secondary-btn">
                    Email Copy to Finance Team
                  </button>
                </div>

                <p className="small-note">
                  Digitally signed and timestamped for audit purposes.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}