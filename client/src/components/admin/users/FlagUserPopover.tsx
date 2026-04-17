type FlagUserPopoverProps = {
  onClose: () => void;
};

export default function FlagUserPopover({ onClose }: FlagUserPopoverProps) {
  return (
    <div className="action-popover action-popover-flag">
      <div className="action-popover-header">
        <div className="action-popover-title-wrap">
         <span className="action-popover-title-icon flag-icon">🚩</span>
          <h3>Flag User Account</h3>
        </div>

        <button type="button" className="popover-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="action-popover-body">
        <div className="popover-field">
          <label>Reason for Flagging</label>
          <select defaultValue="Suspicious Activity">
            <option>Suspicious Activity</option>
            <option>Incomplete Data</option>
            <option>Potential Fraud</option>
            <option>Multiple Failed Filings</option>
            <option>Other</option>
          </select>
        </div>

        <div className="popover-field">
          <label>Additional Notes (Optional)</label>
          <textarea
            rows={5}
            defaultValue={`Unusual transaction patterns detected.
Requires manual review.`}
          />
        </div>

        <div className="action-popover-footer">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>

          <button type="button" className="danger-btn">
            ⚑ Flag Account
          </button>
        </div>
      </div>
    </div>
  );
}