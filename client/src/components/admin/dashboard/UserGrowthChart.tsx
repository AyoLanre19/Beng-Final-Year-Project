import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 2000 },
  { month: "Mar", users: 3000 },
  { month: "Apr", users: 4500 },
];

export default function UserGrowthChart() {
  return (
    <section className="admin-chart-card">
      <h3>User Growth</h3>

      <div className="admin-chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="users" fill="#b7caff" stroke="#5f88ff" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
