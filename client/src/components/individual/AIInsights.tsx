import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "Salary", value: 60 },
  { name: "Freelance", value: 25 },
  { name: "Other", value: 15 }
]

const COLORS = ["#2F80ED", "#56CCF2", "#B6D9FF"]

export default function AIInsights(){

  return(

    <div className="ai-card">

      <h3>AI Confidence</h3>

      <ResponsiveContainer width="100%" height={250}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
          >

            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  )
}