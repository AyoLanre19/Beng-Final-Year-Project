import { PieChart, Pie, Cell } from "recharts"

const data = [
{ name:"Salary", value:60 },
{ name:"Freelance", value:25 },
{ name:"Other", value:15 }
]

const COLORS = ["#4f7cff","#6fa4ff","#c7d6ff"]

export default function ConfidenceChart(){

return(

<div className="card chart-card">

<h3>AI Confidence</h3>

<div className="chart-layout">

<div className="chart-legend">

<div className="legend-item">
<span className="dot salary"></span>
Salary
</div>

<div className="legend-item">
<span className="dot freelance"></span>
Freelance
</div>

<div className="legend-item">
<span className="dot other"></span>
Other
</div>

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

{data.map((entry,index)=>(
<Cell key={index} fill={COLORS[index]} />
))}

</Pie>

</PieChart>

<div className="chart-center">95%</div>

</div>

</div>

</div>

)

}
