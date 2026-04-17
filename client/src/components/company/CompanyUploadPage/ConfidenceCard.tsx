export default function ConfidenceCard() {
  const percent = 92;

  return (
    <div className="confidence glass">

      <h4>AI Confidence</h4>

      <div
        className="confidence-ring"
        style={{
          background: `conic-gradient(#22c55e ${percent}%, #e5e7eb ${percent}% 100%)`
        }}
      >
        <div className="inner">
          <span>{percent}%</span>
        </div>
      </div>

      <p className="accuracy">High Accuracy</p>

    </div>
  );
}