import type { UploadPreviewTransaction } from "../../../services/filingService";

type ConfidenceCardProps = {
  transactions?: UploadPreviewTransaction[];
  aiStatus?: "classified" | "failed" | "processing";
};

export default function ConfidenceCard({
  transactions,
  aiStatus,
}: ConfidenceCardProps) {
  const liveConfidence = (transactions || [])
    .map((transaction) => transaction.confidence)
    .filter((confidence): confidence is number => confidence !== null);

  const percent =
    liveConfidence.length > 0
      ? Math.round(
          (liveConfidence.reduce((sum, confidence) => sum + confidence, 0) /
            liveConfidence.length) *
            100
        )
      : 0;

  return (
    <div className="confidence glass">
      <h4>AI Confidence</h4>

      <div
        className="confidence-ring"
        style={{
          background: `conic-gradient(#22c55e ${percent}%, #e5e7eb ${percent}% 100%)`,
        }}
      >
        <div className="inner">
          <span>{percent}%</span>
        </div>
      </div>

      <p className="accuracy">
        {aiStatus === "classified"
          ? "Classification completed"
          : aiStatus === "processing"
            ? "Preview ready, AI refining"
            : "Review recommended"}
      </p>
    </div>
  );
}
