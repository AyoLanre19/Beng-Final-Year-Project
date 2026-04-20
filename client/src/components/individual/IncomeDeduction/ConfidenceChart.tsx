import { Cell, Pie, PieChart } from "recharts";

type ConfidenceChartProps = {
  averageConfidence?: number | null;
  segments?: Array<{
    name: string;
    value: number;
  }>;
};

const fallbackSegments = [
  { name: "No data", value: 1 },
];

const COLORS = ["#4f7cff", "#6fa4ff", "#c7d6ff"];

export default function ConfidenceChart({
  averageConfidence,
  segments,
}: ConfidenceChartProps) {
  const data = segments && segments.length > 0 ? segments : fallbackSegments;
  const centerLabel =
    averageConfidence !== null && averageConfidence !== undefined
      ? `${Math.round(averageConfidence * 100)}%`
      : "N/A";

  return (
    <div className="card chart-card">
      <h3>Detected Category Mix</h3>

      <div className="chart-layout">
        <div className="chart-legend">
          {data.map((entry, index) => (
            <div className="legend-item" key={entry.name}>
              <span className="dot" style={{ background: COLORS[index % COLORS.length] }} />
              {entry.name}
            </div>
          ))}
        </div>

        <div className="chart-box">
          <PieChart width={160} height={160}>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={70}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>

          <div className="chart-center">{centerLabel}</div>
        </div>
      </div>
    </div>
  );
}
