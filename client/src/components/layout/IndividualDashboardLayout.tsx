import { ReactNode } from "react";
import Sidebar from "../sidebars/IndividualSidebar";
import "../../styles/individual-dashboard.css";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}