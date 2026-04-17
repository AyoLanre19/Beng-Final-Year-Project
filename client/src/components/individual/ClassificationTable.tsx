export interface Transaction {
  date: string;
  description: string;
  amount: number;
  category: string;
}

const categories = [
  "Salary",
  "Freelance Income",
  "Transfer",
  "Expense",
  "Other Income",
  "Unknown",
];

export default function ClassificationTable({
  transactions,
  setTransactions,
}: {
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}) {
  const updateCategory = (index: number, value: string) => {
    const updated = [...transactions];
    updated[index].category = value;
    setTransactions(updated);
  };

  if (transactions.length === 0) return null;

  return (
    <table
      style={{
        width: "100%",
        marginTop: "30px",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Amount</th>
          <th>AI Category</th>
        </tr>
      </thead>

      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={`${transaction.date}-${transaction.description}-${index}`}>
            <td>{transaction.date}</td>
            <td>{transaction.description}</td>
            <td>{transaction.amount}</td>
            <td>
              <select
                value={transaction.category}
                onChange={(e) => updateCategory(index, e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}