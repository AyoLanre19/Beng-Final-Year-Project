import { Response } from "express";
import { pool } from "../config/db.js";
import { calculateTax, type TaxTransaction } from "../services/taxEngine.js";
import type { PortalType } from "../services/portalRules.js";
import { type AuthenticatedRequest } from "../middleware/auth.js";

type DashboardTransactionRow = {
  transaction_date: string | null;
  description: string;
  amount: string | number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: string | number | null;
};

type FilingStatusRow = {
  filing_status: "not_started" | "draft" | "submitted" | "approved" | "audit";
};

type FailedDocumentRow = {
  total: string | number;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

const toPortalType = (value: unknown, fallback: PortalType): PortalType => {
  if (value === "individual" || value === "sme" || value === "company") {
    return value;
  }

  return fallback;
};

const sumAmounts = (
  transactions: TaxTransaction[],
  predicate: (transaction: TaxTransaction) => boolean
): number =>
  round2(
    transactions
      .filter(predicate)
      .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)
  );

const monthLabel = (value: string | null): string => {
  if (!value) {
    return "Undated";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value.slice(0, 7);
  }

  return parsed.toLocaleDateString("en-NG", {
    month: "short",
    year: "2-digit",
  });
};

const getObservedMonthCount = (transactions: DashboardTransactionRow[]): number => {
  const months = new Set(
    transactions
      .map((transaction) => transaction.transaction_date?.slice(0, 7))
      .filter((value): value is string => Boolean(value))
  );

  return Math.max(1, months.size);
};

const getIncomeCategories = (userType: PortalType): string[] => {
  if (userType === "individual") {
    return ["Salary", "OtherIncome"];
  }

  return ["Revenue", "OtherIncome"];
};

const getExpenseCategories = (userType: PortalType): string[] => {
  if (userType === "individual") {
    return ["DeductibleExpense", "PAYE", "Rent", "Utilities", "PersonalExpense"];
  }

  if (userType === "sme") {
    return ["BusinessExpense", "InventoryPurchase", "Payroll", "TaxPayment"];
  }

  return ["BusinessExpense", "AssetPurchase", "Payroll", "VAT", "WithholdingTax", "CorporateTax"];
};

export const getDashboardMetrics = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user?.id;
    const tokenUserType = req.user?.user_type;

    if (!userId || !tokenUserType) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const userType = toPortalType(req.query.userType, toPortalType(tokenUserType, "individual"));

    const transactionResult = await pool.query<DashboardTransactionRow>(
      `SELECT transaction_date, description, amount, direction, category, confidence
       FROM transactions
       WHERE user_id = $1
       ORDER BY transaction_date ASC NULLS LAST, created_at ASC`,
      [userId]
    );

    const filingResult = await pool.query<FilingStatusRow>(
      `SELECT filing_status
       FROM tax_returns
       WHERE user_id = $1
       ORDER BY submitted_at DESC NULLS LAST, id DESC
       LIMIT 1`,
      [userId]
    );

    const failedDocumentResult = await pool.query<FailedDocumentRow>(
      `SELECT COUNT(*) AS total
       FROM documents
       WHERE user_id = $1 AND upload_status = 'failed'`,
      [userId]
    );

    const transactions: DashboardTransactionRow[] = transactionResult.rows;
    const taxTransactions: TaxTransaction[] = transactions.map((transaction) => ({
      description: transaction.description,
      amount: Number(transaction.amount),
      direction: transaction.direction,
      category: transaction.category,
    }));

    const annualizationFactor = round2(12 / getObservedMonthCount(transactions));
    const annualizedTransactions = taxTransactions.map((transaction) => ({
      ...transaction,
      amount: round2(transaction.amount * annualizationFactor),
    }));

    const taxSummary = calculateTax(userType, annualizedTransactions);
    const estimatedTax =
      userType === "individual"
        ? taxSummary.individual?.estimatedTax ?? 0
        : round2(
            (taxSummary.business?.estimatedCompanyIncomeTax ?? 0) +
              (taxSummary.business?.estimatedVat ?? 0) +
              (taxSummary.business?.estimatedWithholdingTax ?? 0)
          );

    const annualizedPayments =
      userType === "individual"
        ? sumAmounts(annualizedTransactions, (transaction) => transaction.category === "PAYE")
        : sumAmounts(annualizedTransactions, (transaction) =>
            ["TaxPayment", "VAT", "WithholdingTax", "CorporateTax"].includes(
              transaction.category || ""
            )
          );

    const paymentStatus =
      estimatedTax === 0
        ? "draft"
        : annualizedPayments > estimatedTax
          ? "overpaid"
          : annualizedPayments < estimatedTax
            ? "underpaid"
            : "up_to_date";

    const fallbackFilingStatus =
      transactions.length > 0 ? "draft" : "not_started";

    const filingStatus =
      filingResult.rows[0]?.filing_status ?? fallbackFilingStatus;

    const incomeCategories = getIncomeCategories(userType);
    const expenseCategories = getExpenseCategories(userType);

    const incomeBase = annualizedTransactions.filter(
      (transaction) =>
        transaction.direction === "inflow" &&
        incomeCategories.includes(transaction.category || "")
    );

    const expenseBase = annualizedTransactions.filter(
      (transaction) =>
        transaction.direction === "outflow" &&
        expenseCategories.includes(transaction.category || "")
    );

    const monthlyIncomeMap = new Map<string, number>();
    const monthlyExpenseMap = new Map<string, number>();

    for (const transaction of transactions) {
      if (
        transaction.direction !== "inflow" ||
        !incomeCategories.includes(transaction.category || "")
      ) {
        continue;
      }

      const key = monthLabel(transaction.transaction_date);
      monthlyIncomeMap.set(key, round2((monthlyIncomeMap.get(key) || 0) + Number(transaction.amount)));
    }

    for (const transaction of transactions) {
      if (
        transaction.direction !== "outflow" ||
        !expenseCategories.includes(transaction.category || "")
      ) {
        continue;
      }

      const key = monthLabel(transaction.transaction_date);
      monthlyExpenseMap.set(key, round2((monthlyExpenseMap.get(key) || 0) + Number(transaction.amount)));
    }

    const incomeSourceMap = new Map<string, number>();
    const expenseBreakdownMap = new Map<string, number>();

    for (const transaction of incomeBase) {
      const key = transaction.category || "Needs review";
      incomeSourceMap.set(key, round2((incomeSourceMap.get(key) || 0) + transaction.amount));
    }

    for (const transaction of expenseBase) {
      const key = transaction.category || "Needs review";
      expenseBreakdownMap.set(key, round2((expenseBreakdownMap.get(key) || 0) + transaction.amount));
    }

    const lowConfidenceCount = transactions.filter(
      (transaction) =>
        transaction.confidence !== null && Number(transaction.confidence) < 0.6
    ).length;
    const uncategorizedCount = transactions.filter(
      (transaction) => !transaction.category
    ).length;
    const failedDocuments = Number(failedDocumentResult.rows[0]?.total ?? 0);
    const riskScore = Math.min(
      99,
      lowConfidenceCount * 8 +
        uncategorizedCount * 12 +
        failedDocuments * 20 +
        (paymentStatus === "underpaid" ? 15 : 0)
    );

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: sumAmounts(
          annualizedTransactions,
          (transaction) =>
            transaction.direction === "inflow" &&
            incomeCategories.includes(transaction.category || "")
        ),
        totalRevenue: userType === "individual" ? undefined : sumAmounts(
          annualizedTransactions,
          (transaction) =>
            transaction.direction === "inflow" &&
            incomeCategories.includes(transaction.category || "")
        ),
        totalExpenses: sumAmounts(expenseBase, () => true),
        estimatedTax,
        vatEstimate: taxSummary.business?.estimatedVat,
        withholdingEstimate: taxSummary.business?.estimatedWithholdingTax,
        paymentStatus,
        filingStatus,
        riskScore,
        payrollTotal: sumAmounts(
          annualizedTransactions,
          (transaction) => transaction.category === "Payroll"
        ),
        monthlyIncomeData: Array.from(monthlyIncomeMap.entries()).map(
          ([month, amount]) => ({
            month,
            amount,
          })
        ),
        monthlyExpenseData: Array.from(monthlyExpenseMap.entries()).map(
          ([month, amount]) => ({
            month,
            amount,
          })
        ),
        incomeSourceData: Array.from(incomeSourceMap.entries())
          .sort((left, right) => right[1] - left[1])
          .slice(0, 6)
          .map(([label, amount]) => ({
            label,
            amount,
          })),
        expenseBreakdownData: Array.from(expenseBreakdownMap.entries())
          .sort((left, right) => right[1] - left[1])
          .slice(0, 6)
          .map(([label, amount]) => ({
            label,
            amount,
          })),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load dashboard metrics";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
