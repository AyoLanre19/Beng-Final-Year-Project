export default function TaxBreakdownTable(){

const data = [

{
category:"Salary tax",
amount:"₦260,000"
},

{
category:"Other income tax",
amount:"₦50,000"
},

{
category:"POS Payment",
amount:"-₦12,000"
},

{
category:"Consulting Fee",
amount:"₦150,000"
},

{
category:"Cash Deposit",
amount:"₦100,000"
}

]

return(

<div className="tax-card">

<h3>Tax Breakdown</h3>

<table className="tax-table">

<thead>

<tr>

<th>Category</th>

<th>Amount</th>

</tr>

</thead>

<tbody>

{data.map((item,i)=>(

<tr key={i}>

<td>{item.category}</td>

<td>{item.amount}</td>

</tr>

))}

</tbody>

</table>

</div>

)

}