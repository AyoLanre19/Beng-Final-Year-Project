import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { DashboardMetricRow } from "../../../services/dashboardService";

type IncomeExpenseChartProps = {
  incomeData: DashboardMetricRow[];
  expenseData: DashboardMetricRow[];
};

export default function IncomeExpenseChart({
  incomeData,
  expenseData,
}: IncomeExpenseChartProps) {
  const mergedData = incomeData.map((row) => ({
    name: row.month,
    income: row.amount,
    expenses:
      expenseData.find((expenseRow) => expenseRow.month === row.month)?.amount || 0,
  }));

  return (
    <div className="chart-card">
      <h3>Income vs Expenses</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={mergedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `₦${Number(value).toLocaleString("en-NG")}`} />
          <Legend />
          <Bar dataKey="income" fill="#3b82f6" />
          <Bar dataKey="expenses" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
