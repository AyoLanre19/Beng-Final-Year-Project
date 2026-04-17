type Props = {
  accepted: boolean;
  onSubmit: () => void;
};

export default function SubmitSection({ accepted, onSubmit }: Props) {
  return (
    <div className="submit-section">

      <button
        className={`submit-btn ${accepted ? "active" : ""}`}
        disabled={!accepted}
        onClick={onSubmit}
      >
        🔒 Submit Corporate Filing
      </button>

      {!accepted && (
        <p className="hint">
          Please accept declaration before submitting
        </p>
      )}

    </div>
  );
}