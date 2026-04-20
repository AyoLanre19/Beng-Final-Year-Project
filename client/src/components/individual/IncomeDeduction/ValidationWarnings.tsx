type ValidationWarningsProps = {
  warnings?: string[];
};

const fallbackWarnings = ["No validation warnings yet."];

export default function ValidationWarnings({
  warnings,
}: ValidationWarningsProps) {
  const items = warnings && warnings.length > 0 ? warnings : fallbackWarnings;

  return (
    <div className="card">
      <h3>Validation Warnings</h3>

      <ul>
        {items.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}
