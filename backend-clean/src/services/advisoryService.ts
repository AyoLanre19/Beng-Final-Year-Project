import { getPortalRules, type PortalType } from "./portalRules.js";

type ClassifiedTransaction = {
  description: string;
  amount: number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: number | null;
};

export type AdvisoryItem = {
  title: string;
  message: string;
  severity: "low" | "medium" | "high";
  source: "rule" | "ai";
};

export type AdvisoryResult = {
  warnings: AdvisoryItem[];
  suggestions: AdvisoryItem[];
  taxTips: AdvisoryItem[];
};

const hasKeyword = (text: string, keywords: string[]): boolean => {
  const normalized = text.toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
};

const sumBy = (
  transactions: ClassifiedTransaction[],
  predicate: (tx: ClassifiedTransaction) => boolean
): number => {
  return transactions
    .filter(predicate)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
};

export const generateAdvisories = (
  userType: PortalType,
  transactions: ClassifiedTransaction[]
): AdvisoryResult => {
  const rules = getPortalRules(userType);

  const warnings: AdvisoryItem[] = [];
  const suggestions: AdvisoryItem[] = [];
  const taxTips: AdvisoryItem[] = [];

  const inflows = transactions.filter((tx) => tx.direction === "inflow");
  const outflows = transactions.filter((tx) => tx.direction === "outflow");

  const lowConfidenceCount = transactions.filter(
    (tx) => tx.confidence !== null && tx.confidence < 0.6
  ).length;

  const uncategorizedCount = transactions.filter(
    (tx) => !tx.category || tx.category.trim() === ""
  ).length;

  if (lowConfidenceCount > 0) {
    warnings.push({
      title: "Low-confidence classifications detected",
      message: `${lowConfidenceCount} transaction(s) may need manual review because the AI confidence is low.`,
      severity: lowConfidenceCount > 5 ? "high" : "medium",
      source: "rule",
    });
  }

  if (uncategorizedCount > 0) {
    warnings.push({
      title: "Uncategorized transactions found",
      message: `${uncategorizedCount} transaction(s) do not yet have a category and may affect analysis quality.`,
      severity: uncategorizedCount > 5 ? "high" : "medium",
      source: "rule",
    });
  }

  if (userType === "individual") {
    const salaryInflows = sumBy(
      transactions,
      (tx) => tx.category === "Salary" && tx.direction === "inflow"
    );

    const payeOutflows = sumBy(
      transactions,
      (tx) => tx.category === "PAYE" && tx.direction === "outflow"
    );

    const deductibleExpenses = sumBy(
      transactions,
      (tx) => tx.category === "DeductibleExpense" && tx.direction === "outflow"
    );

    const possibleRentUtilities = outflows.filter((tx) =>
      hasKeyword(tx.description, ["rent", "utility", "electric", "water", "internet"])
    );

    if (salaryInflows > 0 && payeOutflows === 0) {
      warnings.push({
        title: "Possible untaxed salary inflow",
        message:
          "Salary-like inflows were detected, but no PAYE-related outflows were found. Review whether salary tax has already been deducted.",
        severity: "high",
        source: "rule",
      });
    }

    if (possibleRentUtilities.length > 0) {
      suggestions.push({
        title: "Review household expense tagging",
        message:
          "Some outflows look like rent or utility payments. Confirm whether they should remain personal expenses or be treated differently.",
        severity: "low",
        source: "rule",
      });
    }

    if (deductibleExpenses > 0) {
      taxTips.push({
        title: "Possible deductible expenses found",
        message:
          "You have transactions categorized as deductible expenses. Review them carefully because they may reduce taxable income where applicable.",
        severity: "medium",
        source: "rule",
      });
    }

    if (inflows.length > 0 && salaryInflows === 0) {
      suggestions.push({
        title: "Review non-salary inflows",
        message:
          "Some inflows are not marked as salary. Separate gifts, transfers, side income, and taxable earnings clearly.",
        severity: "medium",
        source: "rule",
      });
    }
  }

  if (userType === "sme") {
    const revenue = sumBy(
      transactions,
      (tx) => tx.category === "Revenue" && tx.direction === "inflow"
    );

    const expenses = sumBy(
      transactions,
      (tx) =>
        ["BusinessExpense", "InventoryPurchase", "Payroll"].includes(tx.category || "") &&
        tx.direction === "outflow"
    );

    const payroll = sumBy(
      transactions,
      (tx) => tx.category === "Payroll" && tx.direction === "outflow"
    );

    const taxPayments = sumBy(
      transactions,
      (tx) => tx.category === "TaxPayment" && tx.direction === "outflow"
    );

    if (revenue > 0 && expenses === 0) {
      warnings.push({
        title: "Revenue recorded without matching expenses",
        message:
          "Revenue inflows were detected, but no meaningful business expense entries were found. This may overstate taxable profit.",
        severity: "high",
        source: "rule",
      });
    }

    if (payroll > 0 && payroll > expenses * 0.6) {
      warnings.push({
        title: "Payroll-heavy transaction pattern",
        message:
          "Payroll forms a large portion of outflows. Review classification to ensure payroll and other business expenses are properly separated.",
        severity: "medium",
        source: "rule",
      });
    }

    if (taxPayments === 0 && revenue > 0) {
      suggestions.push({
        title: "No tax payment entries detected",
        message:
          "The statement does not show clear tax payment transactions. Confirm whether tax-related payments were made through another channel.",
        severity: "medium",
        source: "rule",
      });
    }

    if (expenses > 0) {
      taxTips.push({
        title: "Track allowable business expenses",
        message:
          "Properly classified business expenses may reduce taxable profit. Review major expense outflows carefully.",
        severity: "medium",
        source: "rule",
      });
    }
  }

  if (userType === "company") {
    const vatLike = transactions.filter((tx) =>
      hasKeyword(tx.description, ["vat", "value added tax"])
    );

    const whtLike = transactions.filter((tx) =>
      hasKeyword(tx.description, ["withholding", "wht"])
    );

    const payroll = sumBy(
      transactions,
      (tx) => tx.category === "Payroll" && tx.direction === "outflow"
    );

    const revenue = sumBy(
      transactions,
      (tx) => tx.category === "Revenue" && tx.direction === "inflow"
    );

    if (vatLike.length > 0) {
      warnings.push({
        title: "Possible VAT-related transactions detected",
        message:
          "Some transactions contain VAT-like narration. Review them separately from ordinary revenue and expense lines.",
        severity: "medium",
        source: "rule",
      });
    }

    if (whtLike.length > 0) {
      warnings.push({
        title: "Possible withholding-tax transactions detected",
        message:
          "Some transactions appear related to withholding tax. They should be reviewed for correct treatment in tax reporting.",
        severity: "medium",
        source: "rule",
      });
    }

    if (payroll > 0 && revenue > 0 && payroll > revenue * 0.5) {
      warnings.push({
        title: "High payroll-to-revenue ratio",
        message:
          "Payroll outflows form a large share of inflows. Check whether payroll and operating expenses are properly classified.",
        severity: "medium",
        source: "rule",
      });
    }

    taxTips.push({
      title: "Separate tax-specific categories carefully",
      message:
        "Keep VAT, withholding tax, payroll, asset purchases, and operating expenses clearly separated to improve company tax accuracy.",
      severity: "medium",
      source: "rule",
    });
  }

  if (transactions.length === 0) {
    suggestions.push({
      title: "No transaction data available",
      message:
        "Upload and classify a bank statement before generating advisory insights.",
      severity: "low",
      source: "rule",
    });
  }

  if (warnings.length === 0) {
    warnings.push({
      title: "No major warning detected",
      message:
        "No strong risk signal was detected from the current classified transactions, but manual review is still recommended.",
      severity: "low",
      source: "rule",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      title: "General review suggestion",
      message:
        rules.suggestionHints[0] ||
        "Review your classified transactions carefully before tax calculation.",
      severity: "low",
      source: "rule",
    });
  }

  if (taxTips.length === 0) {
    taxTips.push({
      title: "General tax tip",
      message:
        "Accurate categorization improves tax estimation quality and reduces reporting errors.",
      severity: "low",
      source: "rule",
    });
  }

  return {
    warnings,
    suggestions,
    taxTips,
  };
};