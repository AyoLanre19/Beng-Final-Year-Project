import StatementUploadCard from "../../uploads/StatementUploadCard";
import type {
  UploadFinancialDataResult,
  UploadHistoryItem,
} from "../../../services/filingService";

type UploadSectionProps = {
  onUploaded?: (result: UploadFinancialDataResult) => void;
  result?: UploadFinancialDataResult | null;
  history?: UploadHistoryItem[];
  activeDocumentId?: string | null;
  onSelectDocument?: (documentId: string) => Promise<unknown> | void;
};

export default function UploadSection({
  onUploaded,
  result,
  history,
  activeDocumentId,
  onSelectDocument,
}: UploadSectionProps) {
  return (
    <StatementUploadCard
      title="Upload Company Financial Statement"
      subtitle="Upload a company bank statement, exported ledger, or statement screenshot and the backend will parse and classify the transactions for this company account."
      badge="Company Portal"
      onUploaded={onUploaded}
      result={result}
      history={history}
      activeDocumentId={activeDocumentId}
      onSelectDocument={onSelectDocument}
    />
  );
}
