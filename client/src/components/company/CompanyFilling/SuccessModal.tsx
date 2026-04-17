export default function SuccessModal() {
  return (
    <div className="modal-overlay">

      <div className="modal-content glass">

        <div className="check">✔</div>

        <h2>Corporate Filing Submitted Successfully!</h2>

        <p>Your tax return has been submitted.</p>

        <h3 className="ref">CORP-2024-0425-001</h3>

        <div className="modal-actions">
          <button className="primary-btn">Download Filing PDF</button>
          <button className="secondary-btn">Email Copy</button>
        </div>

        <p className="small">
          This filing has been digitally signed and timestamped.
        </p>

      </div>

    </div>
  );
}