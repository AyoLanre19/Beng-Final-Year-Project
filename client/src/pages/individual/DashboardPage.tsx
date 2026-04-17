import React, { useEffect, useState } from "react";
import type { JSX } from "react";
import { useNavigate } from "react-router-dom";

import IndividualSidebar from "../../components/individual/IndividualSidebar";
import Topbar from "../../components/individual/Topbar";
import MetricCard from "../../components/individual/MetricCard";
import { IncomeLine, IncomeDonut } from "../../components/individual/Charts";
import { getStoredUser } from "../../services/authService";
import { getDashboardMetrics, type DashboardMetrics } from "../../services/dashboardService";

import "../../styles/individual-dashboard.css";

const formatCurrency = (value: number) => `₦${value.toLocaleString("en-NG")}`;

const formatPaymentStatus = (status: DashboardMetrics["paymentStatus"]) => {
  if (status === "underpaid") return "Underpaid";
  if (status === "overpaid") return "Overpaid";
  if (status === "draft") return "Draft";
  return "Up to date";
};

const formatRiskLabel = (riskScore: number) => {
  if (riskScore >= 60) return "High Risk";
  if (riskScore >= 30) return "Medium Risk";
  return "Low Risk";
};

export default function IndividualDashboard(): JSX.Element {
  const navigate = useNavigate();
  const storedUser = getStoredUser();

  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>(storedUser?.fullName || "Ifeanyi");
  const [email, setEmail] = useState<string>(storedUser?.email || "ifeanyi@example.com");
  const [password, setPassword] = useState<string>("");
  const [dashboard, setDashboard] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const openProfile = (): void => setProfileOpen(true);
  const closeProfile = (): void => setProfileOpen(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await getDashboardMetrics("individual");
        setDashboard(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  return (
    <div className="ind-page">
      <IndividualSidebar />

      <div className="ind-main">
        <Topbar onOpenProfile={openProfile} />

        <div className="ind-content">
          <h1 className="page-h1">Dashboard</h1>

          <p className="page-sub">Welcome back, {name}!</p>
          {error && <p className="page-sub" style={{ color: "#c62828" }}>{error}</p>}

          {loading ? (
            <p className="page-sub">Loading dashboard data...</p>
          ) : (
            <>
              <div className="metrics-row">
                <MetricCard title="Total Income Detected">
                  {formatCurrency(dashboard?.totalIncome ?? 0)}
                </MetricCard>

                <MetricCard title="Estimated Tax">
                  {formatCurrency(dashboard?.estimatedTax ?? 0)}
                </MetricCard>

                <MetricCard title="Overpayment / Underpayment">
                  <div className="over-under">{formatPaymentStatus(dashboard?.paymentStatus ?? "draft")}</div>
                </MetricCard>

                <MetricCard title="AI Risk Score">
                  <div className="risk-visual">
                    <div className="risk-circle">{dashboard?.riskScore ?? 0}%</div>
                    <div className="risk-label">{formatRiskLabel(dashboard?.riskScore ?? 0)}</div>
                  </div>
                </MetricCard>
              </div>

              <div className="row-two">
                <div className="upload-col">
                  <div className="upload-card">
                    <div className="upload-title">Upload Bank Statement</div>

                    <button
                      className="btn-primary"
                      onClick={() => navigate("/individual/income-deductions")}
                    >
                      Upload Bank Statement
                    </button>

                    <div className="muted">
                      Upload your latest bank statement for automatic tax analysis. PDF, CSV
                    </div>
                  </div>

                  <div className="chart-row">
                    <IncomeLine data={dashboard?.monthlyIncomeData} />
                  </div>
                </div>

                <div className="side-col">
                  <div className="filling-card">
                    <div className="small-label">Filing Status</div>

                    <div className="f-status">{dashboard?.filingStatus?.replace("_", " ") || "not started"}</div>

                    <button
                      className="btn-secondary"
                      onClick={() => navigate("/individual/tax-summary")}
                    >
                      Review & File
                    </button>
                  </div>

                  <IncomeDonut data={dashboard?.incomeSourceData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {profileOpen && (
        <div className="profile-modal-backdrop" onClick={closeProfile}>
          <div
            className="profile-modal"
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <h3>Edit Profile</h3>

            <label className="label">Full name</label>
            <input
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />

            <label className="label">Email</label>
            <input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />

            <label className="label">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            />

            <div className="modal-actions">
              <button className="btn-secondary" onClick={closeProfile}>
                Cancel
              </button>

              <button className="btn-primary" onClick={closeProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}