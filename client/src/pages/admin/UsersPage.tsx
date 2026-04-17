import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";
import UserFilters from "../../components/admin/users/UserFilters";
import UsersTable from "../../components/admin/users/UsersTable";
import "../../styles/admin-users.css";
import "../../styles/admin-layout.css";

export default function UsersPage() {
  return (
    <div className="admin-layout">
      <div className="admin-shell">
        <AdminSidebar />

        <div className="dashboard-content">
          <AdminTopbar />

          <main className="admin-page-inner">
            <h1 className="admin-page-title">User Monitoring</h1>
            <p className="admin-page-subtitle">
              View and manage all platform users across Individual, SME, and Company portals.
            </p>

            <UserFilters />
            <UsersTable />
          </main>
        </div>
      </div>
    </div>
  );
}