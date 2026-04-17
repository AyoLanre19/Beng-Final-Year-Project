const rows = [
  {
    date: "2024-03-15",
    user: "User_12345",
    description: "POS SALARY ADVANCE",
    aiCategory: "Transfer",
    correctCategory: "Salary",
    confidence: "62%",
    confidenceLevel: "Low",
    status: "Unreviewed",
    action: "Mark as Reviewed",
  },
  {
    date: "2024-03-14",
    user: "User_67890",
    description: "ATM DEBIT - SHOPRITE",
    aiCategory: "Expense",
    correctCategory: "Expense",
    confidence: "78%",
    confidenceLevel: "High",
    status: "Reviewed",
    action: "✓",
  },
  {
    date: "2024-03-14",
    user: "User_54321",
    description: "FREELANCE PAYMENT",
    aiCategory: "Transfer",
    correctCategory: "Other Income",
    confidence: "65%",
    confidenceLevel: "Low",
    status: "Unreviewed",
    action: "Mark as Reviewed",
  },
  {
    date: "2024-03-13",
    user: "User_12345",
    description: "BANK CHARGES",
    aiCategory: "Expense",
    correctCategory: "Expense",
    confidence: "92%",
    confidenceLevel: "High",
    status: "Reviewed",
    action: "✓",
  },
];

export default function MisclassificationsTable() {
  return (
    <section className="ai-monitor-card misclassifications-card">
      <div className="misclassifications-header">
        <h3 className="ai-card-heading">
          Recent Misclassifications / Low Confidence Transactions
        </h3>

        <div className="misclassification-filters">
          <select>
            <option>All Error Types</option>
          </select>

          <select>
            <option>All Confidence Levels</option>
          </select>

          <select>
            <option>Last 30 Days</option>
          </select>

          <button type="button" className="mini-filter-btn">
            ⌁ Filter
          </button>
        </div>
      </div>

      <div className="ai-table-wrap">
        <table className="ai-monitor-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Description</th>
              <th>AI Category</th>
              <th>Correct Category</th>
              <th>Confidence</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.user}</td>
                <td>{row.description}</td>
                <td>
                  <span className="mini-pill teal">{row.aiCategory}</span>
                </td>
                <td>
                  <span className="mini-pill green">{row.correctCategory}</span>
                </td>
                <td>
                  <div className="confidence-cell">
                    <strong>{row.confidence}</strong>
                    <span
                      className={`mini-pill ${
                        row.confidenceLevel === "Low" ? "soft-yellow" : "soft-green"
                      }`}
                    >
                      {row.confidenceLevel}
                    </span>
                  </div>
                </td>
                <td>
                  <span
                    className={`mini-pill ${
                      row.status === "Reviewed" ? "soft-green" : "soft-gray"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td>
                  {row.action === "✓" ? (
                    <button type="button" className="check-action-btn">
                      ✓
                    </button>
                  ) : (
                    <button type="button" className="review-action-btn">
                      {row.action}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}