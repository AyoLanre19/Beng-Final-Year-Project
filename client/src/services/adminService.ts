import { apiClient } from "./apiClient";

export type AdminOverview = {
  metrics: {
    totalUsers: number;
    filingsSubmitted: number;
    totalTaxEstimated: number;
    aiAccuracy: number;
  };
  filingsTrend: Array<{ month: string; filings: number }>;
  userGrowth: Array<{ month: string; users: number }>;
  recentActivity: Array<{
    userId: string;
    name: string;
    email: string;
    type: string;
    filingStatus: string;
    risk: string;
  }>;
};

export type AdminUserRecord = {
  id: string;
  name: string;
  email: string;
  type: string;
  status: "Active" | "Inactive" | "Flagged";
  filingStatus: string;
  riskScore: "Low" | "Medium" | "High";
  riskPercent: number;
  lastActive: string | null;
  uploads: number;
  filings: number;
};

export type AdminFilingsData = {
  filings: Array<{
    filingId: string;
    referenceNumber: string;
    taxPeriod: string;
    totalIncome: number;
    totalExpenses: number;
    totalTax: number;
    filingStatus: string;
    submittedAt: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      type: string;
    };
  }>;
  documents: Array<{
    id: string;
    userId: string;
    originalName: string;
    fileType: string;
    sourceBank?: string | null;
    uploadStatus: string;
    createdAt: string;
  }>;
};

export type AdminAiMonitoring = {
  overallAccuracy: number;
  totalTransactionsProcessed: number;
  averageConfidence: number;
  lowConfidenceCount: number;
  uncategorizedCount: number;
  accuracyTrend: Array<{ month: string; accuracy: number }>;
  errorTypes: Array<{ label: string; value: number }>;
  recentIssues: Array<{
    date: string | null;
    user: string;
    userId: string;
    description: string;
    aiCategory: string;
    confidence: number | null;
  }>;
  alerts: string[];
};

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

export const fetchAdminOverview = async (): Promise<AdminOverview> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: AdminOverview }>("/admin/overview");
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load the admin overview."));
  }
};

export const fetchAdminUsers = async (): Promise<AdminUserRecord[]> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: AdminUserRecord[] }>("/admin/users");
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load admin users."));
  }
};

export const deleteAdminUser = async (userId: string): Promise<void> => {
  try {
    await apiClient.delete(`/admin/users/${userId}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to delete this user account."));
  }
};

export const fetchAdminFilings = async (): Promise<AdminFilingsData> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: AdminFilingsData }>("/admin/filings");
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load admin filings."));
  }
};

export const fetchAdminAiMonitoring = async (): Promise<AdminAiMonitoring> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: AdminAiMonitoring }>("/admin/ai-monitoring");
    return response.data.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Unable to load AI monitoring."));
  }
};
