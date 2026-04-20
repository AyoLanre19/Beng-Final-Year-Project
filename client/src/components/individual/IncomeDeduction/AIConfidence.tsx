type AIConfidenceProps = {
  averageConfidence?: number | null;
  aiStatus?: "classified" | "failed" | "processing";
};

export default function AIConfidence({
  averageConfidence,
  aiStatus,
}: AIConfidenceProps) {
  const confidencePercent =
    averageConfidence !== null && averageConfidence !== undefined
      ? `${Math.round(averageConfidence * 100)}%`
      : "N/A";

  const statusText =
    aiStatus === "classified"
      ? "The uploaded statement was classified by Ollama."
      : aiStatus === "processing"
        ? "The statement is parsed, preview categories are showing now, and Ollama is still refining them in the background."
        : aiStatus === "failed"
          ? "The statement was parsed, but some transactions may still need manual review."
          : "Upload a statement to see confidence and AI timing details.";

  return (
    <div className="card confidence-card">
      <h3>AI Confidence</h3>

      <div className="confidence-content">
        <div className="confidence-list">
          <p>Average confidence: {confidencePercent}</p>
          <p>{statusText}</p>
        </div>
      </div>
    </div>
  );
}
