type ContactUserPopoverProps = {
  onClose: () => void;
};

export default function ContactUserPopover({ onClose }: ContactUserPopoverProps) {
  return (
    <div className="action-popover action-popover-contact">
      <div className="action-popover-header">
        <div className="action-popover-title-wrap">
          <span className="action-popover-title-icon contact-icon">✉️</span>
          <h3>Contact User</h3>
        </div>

        <button type="button" className="popover-close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="action-popover-body">
        <div className="popover-field">
          <label>Contact Method</label>

          <div className="contact-method-row">
            <label className="radio-option">
              <input type="radio" name="contactMethod" defaultChecked />
              <span>Email</span>
            </label>

            <label className="radio-option">
              <input type="radio" name="contactMethod" />
              <span>SMS</span>
            </label>
          </div>
        </div>

        <div className="popover-field">
          <label>Message Template</label>
          <select defaultValue="">
            <option value="" disabled>
              Select a template...
            </option>
            <option>Verification Request</option>
            <option>Risk Alert</option>
            <option>Filing Reminder</option>
          </select>
        </div>

        <div className="popover-field">
          <label>Custom Message</label>
          <textarea
            rows={6}
            defaultValue={`Hello John,

We noticed some activity on your account that requires verification. Please contact support.`}
          />
        </div>

        <div className="action-popover-footer">
          <button type="button" className="ghost-btn" onClick={onClose}>
            Cancel
          </button>

          <button type="button" className="primary-btn">
            ✈ Send Message
          </button>
        </div>
      </div>
    </div>
  );
}