import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";

const accuracyData = [
  { month: "Jan", accuracy: 89 },
  { month: "Feb", accuracy: 94 },
  { month: "Mar", accuracy: 93 },
  { month: "Apr", accuracy: 95 },
  { month: "May", accuracy: 93 },
  { month: "Jun", accuracy: 96 },
];

export default function AiAccuracyChart() {
  return (
    <section className="ai-monitor-card">
      <h3 className="ai-card-heading">AI Accuracy Trend</h3>

      <div style={{ width: "100%", height: 230 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={accuracyData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4f8dff" stopOpacity={0.22} />
                <stop offset="100%" stopColor="#4f8dff" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#eef2fa" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#7f88a8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[80, 100]}
              tick={{ fontSize: 12, fill: "#7f88a8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0)}%`, "Accuracy"]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5ebf7",
                boxShadow: "0 8px 20px rgba(60, 80, 140, 0.08)",
              }}
            />

            <Area
              type="monotone"
              dataKey="accuracy"
              fill="url(#accuracyFill)"
              stroke="none"
            />

            <Line
              type="monotone"
              dataKey="accuracy"
              stroke="#4f8dff"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}