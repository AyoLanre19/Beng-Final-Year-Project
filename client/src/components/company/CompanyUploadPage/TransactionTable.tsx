export default function TransactionTable() {
  const rows = [
    ["Mar 10, 2024", "Client ABC Invoice #234", "₦5,000,000", "Revenue"],
    ["Mar 12, 2024", "Staff Salaries March", "-₦2,500,000", "Payroll"],
    ["Mar 15, 2024", "Office Rent HQ", "-₦800,000", "Expense"],
    ["Mar 18, 2024", "VAT Payment FIRS", "-₦450,000", "VAT"],
    ["Mar 22, 2024", "Tech Solutions Ltd", "-₦1,200,000", "Withholding"],
    ["Mar 25, 2024", "Bank Transfer", "-₦3,000,000", "Transfer"],
  ];

  return (
    <div className="table-card glass">

      <h4>AI Classification</h4>

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
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row[0]}</td>
              <td>{row[1]}</td>
              <td className={row[2].includes("-") ? "neg" : "pos"}>
                {row[2]}
              </td>
              <td>
                <select defaultValue={row[3]}>
                  <option>Revenue</option>
                  <option>Payroll</option>
                  <option>Expense</option>
                  <option>VAT</option>
                  <option>Withholding</option>
                  <option>Transfer</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}