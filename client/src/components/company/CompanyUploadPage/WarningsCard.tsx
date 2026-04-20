type WarningsCardProps = {
  warnings?: string[];
};

const fallbackWarnings = ["No validation warnings yet."];

export default function WarningsCard({ warnings }: WarningsCardProps) {
  const items = warnings && warnings.length > 0 ? warnings : fallbackWarnings;

  return (
    <div className="warnings glass">
      <h4>Validation Warnings</h4>

      <ul>
        {items.map((warning) => (
          <li key={warning}>{warning}</li>
        ))}
      </ul>
    </div>
  );
}
