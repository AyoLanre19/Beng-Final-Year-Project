import AdminSidebar from "../../components/admin/layout/AdminSidebar";
import AdminTopbar from "../../components/admin/layout/AdminTopbar";

import MetricsRow from "../../components/admin/dashboard/MetricsRow";
import FilingsChart from "../../components/admin/dashboard/FilingsChart";
import UserGrowthChart from "../../components/admin/dashboard/UserGrowthChart";
import RecentActivityTable from "../../components/admin/dashboard/RecentActivityTable";

export default function DashboardPage() {
  return (
    <div className="admin-layout">

      <AdminSidebar />

      <div className="dashboard-content">

        <AdminTopbar />

        <div style={{ padding: "20px" }}>
          <h1>Admin Dashboard</h1>
          <p>Overview of platform activity and user statistics.</p>

          <MetricsRow />

          <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
            <FilingsChart />
            <UserGrowthChart />
          </div>

          <RecentActivityTable />
        </div>

      </div>
    </div>
  );
}