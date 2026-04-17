export interface User {
  name: string;
}

export interface TaxSummary {
  totalEstimated: number;
  paid: number;
  due: number;
  nextFilingDate: string;
}

export interface Breakdown {
  paye: number;
  withholding: number;
  vat: number;
  levies: number;
}

export interface FinancialHealth {
  score: number;
  expenseDecline: boolean;
  savingBuffer: boolean;
}

export interface DashboardData {
  user: User;
  taxSummary: TaxSummary;
  breakdown: Breakdown;
  financialHealth: FinancialHealth;
}