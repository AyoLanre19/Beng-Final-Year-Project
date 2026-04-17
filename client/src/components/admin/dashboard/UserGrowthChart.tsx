import {
  AreaChart, Area, XAxis, YAxis, Tooltip
} from "recharts";

const data = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 2000 },
  { month: "Mar", users: 3000 },
  { month: "Apr", users: 4500 },
];

export default function UserGrowthChart() {
  return (
    <AreaChart width={400} height={250} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Area dataKey="users" />
    </AreaChart>
  );
}