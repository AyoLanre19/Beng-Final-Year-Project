import type { DashboardData } from "../types/dashboard";

// sample dashboard data used by charts and cards
export const metrics = {
  totalIncome: "₦2,150,000",
  estimatedTax: "₦310,000",
  overUnder: "No issue detected",
  riskScore: 8, // percent
};

export const monthlyIncome = [
  { month: "Jan", value: 280000 },
  { month: "Feb", value: 320000 },
  { month: "Mar", value: 370000 },
  { month: "Apr", value: 420000 },
];

export const incomeSources = [
  { name: "Salary", value: 70 },
  { name: "Freelance", value: 20 },
  { name: "Other", value: 10 },
];

const dashboard: DashboardData = {
  user: {
    name: "Ifeanyi",
  },
  taxSummary: {
    totalEstimated: 310000,
    paid: 265000,
    due: 45000,
    nextFilingDate: "2026-05-30",
  },
  breakdown: {
    paye: 120000,
    withholding: 50000,
    vat: 90000,
    levies: 50000,
  },
  financialHealth: {
    score: 82,
    expenseDecline: false,
    savingBuffer: true,
  },
};

export default dashboard;