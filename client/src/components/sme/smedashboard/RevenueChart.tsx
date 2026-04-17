import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  {name:"Jan", revenue:3500000},
  {name:"Feb", revenue:2500000},
  {name:"Mar", revenue:4200000},
  {name:"Apr", revenue:4700000}
];

export default function RevenueChart(){

  return(
    <div className="chart-card">
      <h3>Monthly Revenue Trend</h3>

      <BarChart width={400} height={250} data={data}>
        <XAxis dataKey="name"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="revenue" fill="#10b981"/>
      </BarChart>
    </div>
  );
}