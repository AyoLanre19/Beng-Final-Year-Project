type SuggestedReliefsProps = {
  items?: string[];
};

const fallbackItems = ["No relief hints yet. Upload or select a parsed statement first."];

export default function SuggestedReliefs({ items }: SuggestedReliefsProps) {
  const reliefs = items && items.length > 0 ? items : fallbackItems;

  return (
    <div className="card">
      <h3>Suggested Reliefs Detected</h3>

      <ul>
        {reliefs.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
