import { PieChart, Pie, Cell } from "recharts";

interface Props {
  score: number;
}

const FinancialHealthChart = ({ score }: Props) => {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const COLORS = ["#2563eb", "#e5e7eb"];

  return (
    <div className="bg-white rounded-2xl shadow p-6 w-full">
      <h3 className="text-lg font-semibold mb-4">
        Financial Health Score
      </h3>

      <div className="flex justify-center relative">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            innerRadius={70}
            outerRadius={100}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        <div className="absolute top-[90px] text-2xl font-bold">
          {score}
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthChart;