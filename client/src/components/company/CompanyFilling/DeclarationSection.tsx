type Props = {
  accepted: boolean;
  setAccepted: (val: boolean) => void;
};

export default function DeclarationSection({ accepted, setAccepted }: Props) {
  return (
    <div className="declaration-card glass">

      <h3>Declaration & Consent</h3>

      <label className="checkbox">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />

        <span>
          I declare that I am an authorized signatory and that the information
          provided is true, complete, and correct.
        </span>
      </label>

    </div>
  );
}