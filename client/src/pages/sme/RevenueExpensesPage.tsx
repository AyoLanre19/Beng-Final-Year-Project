import "../../styles/sme-revenue-expenses.css";
import SmeSidebar from "../../components/sme/SmeSidebar";
import SmeTopbar from "../../components/sme/SmeTopbar";

export default function RevenueExpensesPage() {

  const transactions = [
    { date: "Feb 15, 2024", desc: "Payment from Client ABC", amount: 1200000, category: "Revenue" },
    { date: "Feb 18, 2024", desc: "Office Rent", amount: -350000, category: "Expense" },
    { date: "Feb 20, 2024", desc: "Supplier Payment", amount: -150000, category: "Expense" },
    { date: "Feb 25, 2024", desc: "VAT Payment", amount: -60000, category: "VAT Payment" },
    { date: "Mar 3, 2024", desc: "POS Sale", amount: 280000, category: "Revenue" },
    { date: "Mar 5, 2024", desc: "Transfer to Owner", amount: -200000, category: "Owner's Draw" },
  ];

  return (
    <div className="sme-layout">

      <SmeSidebar />

      <div className="sme-main">
        <SmeTopbar />

        <div className="sme-content">

          <div className="sme-re-page">

            <h2 className="sme-title">Revenue & Expense Analysis</h2>
            <p className="sme-sub">
              Upload business bank statement to revenue.
            </p>

            {/* UPLOAD */}
            <div className="upload-card glass">
              <div className="upload-header">
                <h4>Upload Business Bank Statement</h4>
                <span className="status">354 checking</span>
              </div>

              <div className="upload-box">
                <p className="upload-text">Analyzing statement...</p>
                <p className="upload-sub">Supports: PDF, CSV</p>
                <button className="browse-btn">Browse Files</button>
              </div>
            </div>

            {/* TABLE */}
            <h3 className="section-title">AI Classification</h3>

            <div className="table-wrapper glass">
              <table className="sme-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="right">Amount</th>
                    <th>AI Category</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i}>
                      <td>{t.date}</td>
                      <td>{t.desc}</td>

                      <td className={`right ${t.amount < 0 ? "neg" : "pos"}`}>
                        {t.amount < 0 ? "-₦" : "₦"}
                        {Math.abs(t.amount).toLocaleString()}
                      </td>

                      <td>
                        <select defaultValue={t.category}>
                          <option>Revenue</option>
                          <option>Expense</option>
                          <option>Transfer</option>
                          <option>Owner's Draw</option>
                          <option>VAT Payment</option>
                          <option>Unknown</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* INSIGHTS */}
            <div className="insight-grid">

              <div className="card glass">
                <p>Total Revenue</p>
                <h2>₦8,500,000</h2>
              </div>

              <div className="card glass">
                <p>Total Expenses</p>
                <h2>₦4,200,000</h2>
              </div>

              <div className="card glass">
                <p>VAT Indicators</p>
                <h2>₦320,000 <span>(estimated)</span></h2>
              </div>

              <div className="card warning glass">
                <p>Warnings</p>
                <ul>
                  <li>⚠ Large unreconciled transfer</li>
                  <li>⚠ Possible personal expense detected</li>
                  <li>⚠ Missing VAT on large invoice</li>
                </ul>
              </div>

            </div>

            {/* BUTTON */}
            <div className="confirm-wrap">
              <button className="confirm-btn">Confirm Data</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}