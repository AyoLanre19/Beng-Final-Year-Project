import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import UserDetailsCard from "../../components/admin/fillings/UserDetailsCard";
import AiCalculationsCard from "../../components/admin/fillings/AiCalculationsCard";
import SubmittedDocumentsCard from "../../components/admin/fillings/SubmittedDocumentsCard";
import FilingActionsBar from "../../components/admin/fillings/FilingActionsBar";
import "../../styles/admin-layout.css";
import "../../styles/admin-filings.css";

export default function FilingsPage() {
  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="dashboard-content">
          <AdminTopbar />

          <main className="admin-page-inner">
            <div className="filing-page-header">
              <h1 className="admin-page-title">Filing Review</h1>
              <p className="filing-breadcrumb">User Monitoring &gt; Filing Review</p>
            </div>

            <section className="filing-review-grid">
              <UserDetailsCard />
              <AiCalculationsCard />
              <SubmittedDocumentsCard />
            </section>

            <FilingActionsBar />
          </main>
        </div>
      </div>
    </div>
  );
}