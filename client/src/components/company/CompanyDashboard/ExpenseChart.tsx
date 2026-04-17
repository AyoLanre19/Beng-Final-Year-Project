import {
  PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Payroll", value: 40 },
  { name: "Operations", value: 25 },
  { name: "Marketing", value: 15 },
  { name: "Other", value: 20 },
];

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#c7d2fe"];

export default function ExpenseChart() {
  return (
    <div className="chart-card glass">

      <h4>Expense Breakdown</h4>

      <div className="expense-content">

        {/* LEFT LEGEND */}
        <div className="legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <span
                className="dot"
                style={{ background: COLORS[index] }}
              ></span>
              {item.name}
            </div>
          ))}
        </div>

        {/* RIGHT PIE */}
        <div className="pie-wrap">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}