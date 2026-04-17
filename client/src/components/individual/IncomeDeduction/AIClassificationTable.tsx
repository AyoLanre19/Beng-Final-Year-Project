interface Props{
transactions:any[]
}

export default function AIClassificationTable({transactions}:Props){

return(

<div className="table-card">

<h3>AI Classification</h3>

<table>

<thead>

<tr>

<th>Date</th>

<th>Description</th>

<th>Amount</th>

<th>AI Category</th>

</tr>

</thead>

<tbody>

{transactions.map((t,i)=>(

<tr key={i}>

<td>{t.date}</td>

<td>{t.description}</td>

<td>{t.amount}</td>

<td>{t.category}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}