import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";
import StatCard from "../../components/sme/smedashboard/StatCard";
import RevenueChart from "../../components/sme/smedashboard/RevenueChart";
import IncomeExpenseChart from "../../components/sme/smedashboard/IncomeExpenseChart";
import "../../styles/sme-dashboard.css";

export default function SmeDashboard(){

  return(
    <div className="sme-layout">

      <SmeSidebar/>

      <div className="sme-main">

        <SmeTopbar/>

        <div className="sme-content">

          <h1>Dashboard</h1>
          <p>Welcome back, Ifeanyi!</p>

          {/* METRICS */}
          <div className="sme-cards">

            <StatCard title="Total Revenue Detected" value="₦8,500,000"/>
            <StatCard title="Estimated Tax" value="₦1,200,000"/>
            <StatCard title="VAT Estimate" value="₦300,000"/>
            <StatCard title="Filing Status" value="Not Filed"/>

          </div>

          {/* UPLOAD */}
          <div className="upload-box">
            <h3>Upload Bank Statement</h3>

            <button className="upload-btn">
              Upload Statement
            </button>

            <p>PDF, CSV supported</p>
          </div>

          {/* CHARTS */}
          <div className="charts">

            <RevenueChart/>
            <IncomeExpenseChart/>

          </div>

        </div>

      </div>

    </div>
  );
}