import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { month: "Jan", value: 25000000 },
  { month: "Feb", value: 24000000 },
  { month: "Mar", value: 30000000 },
  { month: "Apr", value: 35000000 },
  { month: "May", value: 45000000 },
];

export default function RevenueChart() {
  return (
    <div className="chart-card glass">
      <h4>Revenue Trend</h4>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}