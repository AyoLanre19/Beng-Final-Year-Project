import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../../styles/individual-dashboard.css";
import { monthlyIncome, incomeSources } from "../../data/dashboard";

const COLORS = ["#2F80ED", "#56CCF2", "#B6D9FF"];

type MonthlyIncomePoint = {
  month: string;
  value?: number;
  amount?: number;
};

type IncomeSourcePoint = {
  name?: string;
  label?: string;
  value?: number;
  amount?: number;
};

export function IncomeLine({ data }: { data?: MonthlyIncomePoint[] }) {
  const rawData: MonthlyIncomePoint[] = data?.length
    ? data
    : monthlyIncome.map((item) => ({ month: item.month, value: item.value }));

  const chartData = rawData.map((item) => ({
    month: item.month,
    value: item.value ?? item.amount ?? 0,
  }));

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly Income</div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <CartesianGrid stroke="#eee" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(value) => `₦${Math.round(Number(value) / 1000)}k`} axisLine={false} tickLine={false} />
          <Line type="monotone" dataKey="value" stroke="#2F80ED" strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeDonut({ data }: { data?: IncomeSourcePoint[] }) {
  const rawData: IncomeSourcePoint[] = data?.length
    ? data
    : incomeSources.map((item) => ({ name: item.name, value: item.value }));

  const chartData = rawData.map((item) => ({
    name: item.name ?? item.label ?? "Unknown",
    value: item.value ?? item.amount ?? 0,
  }));
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="chart-card donut">
      <div className="chart-title">Income Sources</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
          >
            {chartData.map((entry, idx) => (
              <Cell key={`c-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="donut-legend">
        {chartData.map((item, index) => {
          const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={`${item.name}-${index}`} className="legend-item">
              <span className="legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
              <span>{item.name}</span>
              <span className="muted">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}