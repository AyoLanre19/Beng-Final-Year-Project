import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", filings: 2000 },
  { month: "Feb", filings: 3000 },
  { month: "Mar", filings: 4000 },
  { month: "Apr", filings: 5000 },
];

export default function FilingsChart() {
  return (
    <section className="admin-chart-card">
      <h3>Submitted Filings</h3>

      <div className="admin-chart-shell">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="filings" stroke="#4f8dff" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
