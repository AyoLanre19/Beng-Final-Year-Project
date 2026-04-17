export default function FilingActionsBar() {
  const handleApprove = () => {
    alert("Filing approved successfully.");
  };

  const handleClarification = () => {
    alert("Clarification request sent to user.");
  };

  const handleAuditFlag = () => {
    alert("Filing flagged for audit review.");
  };

  return (
    <section className="filing-actions-bar">
      <button
        type="button"
        className="filing-action-btn approve"
        onClick={handleApprove}
      >
        ✔ Approve Filing
      </button>

      <button
        type="button"
        className="filing-action-btn clarify"
        onClick={handleClarification}
      >
        💬 Request Clarification
      </button>

      <button
        type="button"
        className="filing-action-btn audit"
        onClick={handleAuditFlag}
      >
        🚩 Flag Audit Risk
      </button>
    </section>
  );
}