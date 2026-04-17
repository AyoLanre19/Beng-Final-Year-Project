import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const data = [
  {name:"Jan", income:2000000, expenses:1500000},
  {name:"Feb", income:3000000, expenses:2200000},
  {name:"Mar", income:3500000, expenses:2000000},
  {name:"Apr", income:2800000, expenses:3300000}
];

export default function IncomeExpenseChart(){

  return(
    <div className="chart-card">
      <h3>Income vs Expenses</h3>

      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Legend/>
        <Bar dataKey="income" fill="#3b82f6"/>
        <Bar dataKey="expenses" fill="#ef4444"/>
      </BarChart>
    </div>
  );
}