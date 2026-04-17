import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../../data/dashboard";
import type { DashboardData } from "../../../types/dashboard";
import FinancialHealthChart from "../../../components/dashboard/FinancialHealthChart";
import WarningCard from "../../../components/dashboard/WarningCard";

const IndividualDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setData(dashboard);
  }, []);

  if (!data) return <div>Loading...</div>;

  const { user, taxSummary, financialHealth } = data;

  return (
    <div className="p-8 flex-1 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Welcome, {user.name} 👋</h1>

      <WarningCard due={taxSummary.due} />

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Estimated Tax Due</h3>
          <p className="text-2xl font-bold text-gray-800">
            ₦{taxSummary.totalEstimated.toLocaleString()}
          </p>

          <button
            onClick={() => navigate("/tax-breakdown")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            View Breakdown
          </button>
        </div>

        <FinancialHealthChart score={financialHealth.score} />
      </div>
    </div>
  );
};

export default IndividualDashboard;