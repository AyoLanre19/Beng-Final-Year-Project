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

export const calculateTaxPreview = async (
  userType: "individual" | "sme" | "company"
): Promise<TaxCalculationResult> => {
  const response = await apiClient.post<{ success: boolean; data: TaxCalculationResult }>("/calculate", {
    userType,
  });

  return response.data.data;
};

export const submitTaxFiling = async (
  payload: SubmitFilingPayload
): Promise<FilingSubmissionResult> => {
  const response = await apiClient.post<{ success: boolean; data: FilingSubmissionResult }>(
    "/submit-filing",
    payload
  );

  return response.data.data;
};

export const downloadFilingPdf = async (filingId: string) => {
  const response = await apiClient.get(`/download-filing/${filingId}`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(response.data as Blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `filing-${filingId}.pdf`;
  anchor.click();
  window.URL.revokeObjectURL(url);
};

export interface UploadFinancialDataResult {
  message: string;
  rowsParsed?: number;
  transactionsCreated?: number;
  document?: {
    id: string;
    original_name?: string;
    file_type?: string;
    created_at?: string;
  };
}

export const uploadFinancialData = async (
  file: File
): Promise<UploadFinancialDataResult> => {
  const formData = new FormData();
  formData.append("statement", file);

  const response = await apiClient.post<UploadFinancialDataResult>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
