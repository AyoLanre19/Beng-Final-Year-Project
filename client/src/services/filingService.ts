import { apiClient } from "./apiClient";

export interface TaxBreakdownItem {
  label: string;
  amount: number;
  basis?: string;
  rate?: number;
  note?: string;
}

export interface TaxCalculationResult {
  userType: "individual" | "sme" | "company";
  calculationMode: "annualized_forecast";
  projectionNote: string;
  monthsObserved: number;
  annualizationFactor: number;
  periodStart: string | null;
  periodEnd: string | null;
  observedPeriodIncome: number;
  observedPeriodExpenses: number;
  observedPeriodNet: number;
  monthlyTaxEstimate: number;
  annualTaxForecast: number;
  grossIncome: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  reliefAmount: number;
  taxableIncome: number;
  totalTax: number;
  vatAmount: number;
  withholdingAmount: number;
  payeAlreadyPaid: number;
  overpayment: number;
  underpayment: number;
  effectiveTaxRate: number;
  breakdown: TaxBreakdownItem[];
  warnings: string[];
  lawReferences: string[];
}

export interface SubmitFilingPayload {
  userType: "individual" | "sme" | "company";
  taxPeriod: string;
  totalIncome: number;
  totalExpenses: number;
  totalTax: number;
  vatAmount: number;
  withholdingAmount: number;
  breakdown: TaxBreakdownItem[];
  filingData?: Record<string, unknown>;
}

export interface FilingSubmissionResult {
  success: boolean;
  referenceNumber: string;
  filingId: string;
}

export interface UploadPreviewTransaction {
  transaction_date: string | null;
  description: string;
  amount: number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: number | null;
}

export interface UploadAiResult {
  model: string;
  status: "classified" | "failed" | "processing";
  warning?: string;
}

export interface UploadFinancialDataResult {
  message: string;
  rowsParsed: number;
  transactionsCreated: number;
  transactionsClassified?: number;
  sourceBank?: string | null;
  warnings: string[];
  ai: UploadAiResult;
  previewTransactions: UploadPreviewTransaction[];
  document?: {
    id: string;
    original_name?: string;
    file_type?: string;
    created_at?: string;
  };
}

export interface UploadHistoryItem {
  id: string;
  original_name: string;
  file_type: string;
  source_bank?: string | null;
  upload_status: string;
  created_at: string;
  transactionsCreated: number;
  transactionsClassified: number;
}

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;

    if (typeof response?.data?.message === "string" && response.data.message.length > 0) {
      return response.data.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
};

export const calculateTaxPreview = async (
  userType: "individual" | "sme" | "company"
): Promise<TaxCalculationResult> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: TaxCalculationResult }>(
      "/tax/calculate",
      {
        userType,
      }
    );

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to calculate your tax preview right now."));
  }
};

export const submitTaxFiling = async (
  payload: SubmitFilingPayload
): Promise<FilingSubmissionResult> => {
  try {
    const response = await apiClient.post<{ success: boolean; data: FilingSubmissionResult }>(
      "/tax/submit-filing",
      payload
    );

    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to submit the tax filing right now."));
  }
};

export const downloadFilingPdf = async (filingId: string) => {
  try {
    const response = await apiClient.get(`/tax/download-filing/${filingId}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data as Blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `filing-${filingId}.pdf`;
    anchor.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to download the filing PDF right now."));
  }
};

export const uploadFinancialData = async (
  file: File
): Promise<UploadFinancialDataResult> => {
  try {
    const formData = new FormData();
    formData.append("statement", file);

    const response = await apiClient.post<UploadFinancialDataResult>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 300000,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to upload and parse this statement."));
  }
};

export const fetchUploadProcessingStatus = async (
  documentId: string
): Promise<UploadFinancialDataResult> => {
  try {
    const response = await apiClient.get<UploadFinancialDataResult>(
      `/upload/${documentId}/status`,
      {
        timeout: 30000,
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to refresh AI classification status."));
  }
};

export const fetchUploadHistory = async (
  limit = 10
): Promise<UploadHistoryItem[]> => {
  try {
    const response = await apiClient.get<{
      message: string;
      history: UploadHistoryItem[];
    }>("/upload/history", {
      params: { limit },
      timeout: 30000,
    });

    return response.data.history;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load your previous uploads."));
  }
};
