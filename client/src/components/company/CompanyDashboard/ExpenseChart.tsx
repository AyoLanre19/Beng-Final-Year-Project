import {
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import type { IncomeSourceRow } from "../../../services/dashboardService";

type ExpenseChartProps = {
  data: IncomeSourceRow[];
};

const COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#c7d2fe", "#1d4ed8", "#bfdbfe"];

export default function ExpenseChart({ data }: ExpenseChartProps) {
  return (
    <div className="chart-card glass">
      <h4>Expense Breakdown</h4>

      <div className="expense-content">
        <div className="legend">
          {data.map((item, index) => (
            <div key={item.label} className="legend-item">
              <span
                className="dot"
                style={{ background: COLORS[index % COLORS.length] }}
              ></span>
              {item.label}
            </div>
          ))}
        </div>

        <div className="pie-wrap">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={data}
                innerRadius={45}
                outerRadius={70}
                paddingAngle={2}
                dataKey="amount"
              >
                {data.map((item, index) => (
                  <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
