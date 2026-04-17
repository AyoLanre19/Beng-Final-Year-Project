import { apiClient } from "./apiClient";

export interface DashboardMetricRow {
  month: string;
  amount: number;
}

export interface IncomeSourceRow {
  label: string;
  amount: number;
}

export interface DashboardMetrics {
  totalIncome?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  estimatedTax: number;
  vatEstimate?: number;
  paymentStatus: "up_to_date" | "underpaid" | "overpaid" | "draft";
  filingStatus: "not_started" | "draft" | "submitted" | "approved" | "audit";
  riskScore: number;
  payrollTotal?: number;
  withholdingEstimate?: number;
  monthlyIncomeData: DashboardMetricRow[];
  incomeSourceData: IncomeSourceRow[];
}

export const getDashboardMetrics = async (userType?: string): Promise<DashboardMetrics> => {
  const response = await apiClient.get<{ success: boolean; data: DashboardMetrics }>("/dashboard", {
    params: userType ? { userType } : undefined,
  });

  return response.data.data;
};
