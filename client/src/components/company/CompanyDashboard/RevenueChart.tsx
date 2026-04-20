import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import type { DashboardMetricRow } from "../../../services/dashboardService";

type RevenueChartProps = {
  data: DashboardMetricRow[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="chart-card glass">
      <h4>Revenue Trend</h4>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip formatter={(value) => `₦${Number(value).toLocaleString("en-NG")}`} />

          <Line
            type="monotone"
            dataKey="amount"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
