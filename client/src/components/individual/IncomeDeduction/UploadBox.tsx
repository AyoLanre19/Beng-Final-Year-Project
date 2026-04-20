import StatementUploadCard from "../../uploads/StatementUploadCard";
import type {
  UploadFinancialDataResult,
  UploadHistoryItem,
} from "../../../services/filingService";

type UploadBoxProps = {
  onUploaded?: (result: UploadFinancialDataResult) => void;
  result?: UploadFinancialDataResult | null;
  history?: UploadHistoryItem[];
  activeDocumentId?: string | null;
  onSelectDocument?: (documentId: string) => Promise<unknown> | void;
};

export default function UploadBox({
  onUploaded,
  result,
  history,
  activeDocumentId,
  onSelectDocument,
}: UploadBoxProps) {
  return (
    <StatementUploadCard
      title="Upload Personal Bank Statement"
      subtitle="Send a bank statement from your phone or laptop and the platform will parse the transactions for income, deductions, and PAYE review."
      badge="Individual Portal"
      onUploaded={onUploaded}
      result={result}
      history={history}
      activeDocumentId={activeDocumentId}
      onSelectDocument={onSelectDocument}
    />
  );
}
