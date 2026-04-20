import { useEffect, useState } from "react";
import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import "../../styles/admin-filings.css";
import {
  fetchAdminFilings,
  type AdminFilingsData,
} from "../../services/adminService";

const formatCurrency = (value: number) => `₦${Math.round(value).toLocaleString("en-NG")}`;

export default function FilingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filings, setFilings] = useState<AdminFilingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadFilings = async () => {
      try {
        setLoading(true);
        const data = await fetchAdminFilings();
        setFilings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load admin filings.");
      } finally {
        setLoading(false);
      }
    };

    void loadFilings();
  }, []);

  return (
    <div className="admin-layout">
      <div className={`admin-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
        <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="dashboard-content">
          <AdminTopbar
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            isSidebarOpen={sidebarOpen}
          />

          <main className="admin-page-inner">
            <div className="filing-page-header">
              <h1 className="admin-page-title">Filing Review</h1>
              <p className="filing-breadcrumb">Live filings and uploaded documents from the database</p>
            </div>
            {error ? <p className="filing-breadcrumb" style={{ color: "#c62828" }}>{error}</p> : null}

            {loading ? (
              <p className="filing-breadcrumb">Loading filings...</p>
            ) : filings ? (
              <>
                <section className="filing-card">
                  <div className="filing-card-title">
                    <h3>Saved Forecasts / Filings</h3>
                  </div>

                  <div className="users-table-wrap">
                    <table className="users-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Type</th>
                          <th>Reference</th>
                          <th>Tax Period</th>
                          <th>Total Tax</th>
                          <th>Status</th>
                          <th>Submitted</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filings.filings.map((filing) => (
                          <tr key={filing.filingId}>
                            <td>{filing.user.name}</td>
                            <td>{filing.user.type}</td>
                            <td>{filing.referenceNumber}</td>
                            <td>{filing.taxPeriod}</td>
                            <td>{formatCurrency(filing.totalTax)}</td>
                            <td>{filing.filingStatus}</td>
                            <td>{filing.submittedAt ? new Date(filing.submittedAt).toLocaleString("en-NG") : "Not submitted"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section className="filing-card">
                  <div className="filing-card-title">
                    <h3>Submitted Documents</h3>
                  </div>

                  <div className="documents-list">
                    {filings.documents.map((document) => (
                      <div className="document-row" key={document.id}>
                        <div className="document-meta">
                          <span className="document-icon">📄</span>
                          <div>
                            <p className="document-name">{document.originalName}</p>
                            <span className="document-size">
                              {document.fileType} • {document.sourceBank || "Unknown bank"} • {document.uploadStatus}
                            </span>
                          </div>
                        </div>

                        <div className="document-actions">
                          <span>{new Date(document.createdAt).toLocaleString("en-NG")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
