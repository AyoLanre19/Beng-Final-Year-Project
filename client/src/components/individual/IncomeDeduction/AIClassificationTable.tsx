type ClassificationRow = {
  date: string;
  description: string;
  amount: string;
  category: string;
};

type Props = {
  transactions: ClassificationRow[];
};

export default function AIClassificationTable({ transactions }: Props) {
  return (
    <div className="table-card">
      <h3>Parsed Statement Preview</h3>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Detected Category</th>
          </tr>
        </thead>

        <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <tr key={`${transaction.date}-${transaction.description}-${transaction.amount}`}>
                <td>{transaction.date}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount}</td>
                <td>{transaction.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No parsed statement selected yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
