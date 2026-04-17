import {
  LineChart, Line, XAxis, YAxis, Tooltip
} from "recharts";

const data = [
  { month: "Jan", filings: 2000 },
  { month: "Feb", filings: 3000 },
  { month: "Mar", filings: 4000 },
  { month: "Apr", filings: 5000 },
];

export default function FilingsChart() {
  return (
    <LineChart width={400} height={250} data={data}>
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Line type="monotone" dataKey="filings" />
    </LineChart>
  );
}