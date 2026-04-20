import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import type { DashboardMetricRow } from "../../../services/dashboardService";

type RevenueChartProps = {
  data: DashboardMetricRow[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="chart-card">
      <h3>Monthly Revenue Trend</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₦${Number(value).toLocaleString("en-NG")}`} />
          <Bar dataKey="amount" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
