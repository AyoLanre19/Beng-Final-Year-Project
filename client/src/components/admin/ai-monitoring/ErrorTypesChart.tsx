import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const errorTypes = [
  { name: "Salary misclassified", value: 35, color: "#4f8dff" },
  { name: "Expense vs. Transfer confusion", value: 28, color: "#f27078" },
  { name: "Revenue vs. Other Income", value: 22, color: "#8d7af0" },
  { name: "VAT calculation errors", value: 15, color: "#5bc8b0" },
];

export default function ErrorTypesChart() {
  return (
    <section className="ai-monitor-card">
      <h3 className="ai-card-heading">Common Error Types</h3>

      <div className="donut-layout">
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={errorTypes}
                dataKey="value"
                nameKey="name"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={1}
                stroke="none"
              >
                {errorTypes.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [`${Number(value ?? 0)}%`, "Share"]}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #e5ebf7",
                  boxShadow: "0 8px 20px rgba(60, 80, 140, 0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="donut-legend">
          {errorTypes.map((item) => (
            <div className="legend-row" key={item.name}>
              <span
                className="legend-dot"
                style={{ background: item.color }}
              />
              <span className="legend-label">{item.name}</span>
              <strong className="legend-value">{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}