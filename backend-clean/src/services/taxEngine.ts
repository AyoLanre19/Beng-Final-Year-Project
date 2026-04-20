import type { PortalType } from "./portalRules.js";

export type TaxTransaction = {
  description: string;
  amount: number;
  direction: "inflow" | "outflow";
  category: string | null;
};

export type IndividualTaxBreakdown = {
  grossIncome: number;
  taxableIncomeBeforeReliefs: number;
  consolidatedRelief: number;
  deductibleExpenses: number;
  taxableIncomeAfterReliefs: number;
  estimatedTax: number;
};

export type BusinessTaxBreakdown = {
  revenue: number;
  expenses: number;
  payroll: number;
  taxPayments: number;
  netProfit: number;
  estimatedCompanyIncomeTax: number;
  estimatedVat: number;
  estimatedWithholdingTax: number;
};

export type TaxEngineResult = {
  userType: PortalType;
  totals: {
    totalInflows: number;
    totalOutflows: number;
  };
  individual?: IndividualTaxBreakdown;
  business?: BusinessTaxBreakdown;
};

type PersonalTaxBand = {
  upperLimit: number | null;
  rate: number;
};

type TaxEngineConfig = {
  personalTaxBands: PersonalTaxBand[];
  consolidatedReliefBase: number;
  consolidatedReliefRate: number;
  companyIncomeTax: {
    smallCompanyRate: number;
    mediumOrLargeRate: number;
  };
  vatRate: number;
  withholdingTaxRate: number;
};

const config: TaxEngineConfig = {
  /**
   * These are the project bracket assumptions you've been using.
   * Keep them here so you can swap them quickly if you need to adjust before defense.
   */
  personalTaxBands: [
    { upperLimit: 800_000, rate: 0.0 },
    { upperLimit: 3_000_000, rate: 0.15 },
    { upperLimit: 12_000_000, rate: 0.18 },
    { upperLimit: 25_000_000, rate: 0.21 },
    { upperLimit: 50_000_000, rate: 0.23 },
    { upperLimit: null, rate: 0.25 },
  ],

  /**
   * Project assumption for relief:
   * 20% of gross income, configurable.
   */
  consolidatedReliefBase: 0,
  consolidatedReliefRate: 0.2,

  /**
   * Official framework under Nigeria Tax Act 2025 indicates 0% for small companies
   * and a separate rate for other companies. Keep this configurable.
   */
  companyIncomeTax: {
    smallCompanyRate: 0.0,
    mediumOrLargeRate: 0.30,
  },

  /**
   * VAT remains 7.5% in the official materials.
   */
  vatRate: 0.075,

  /**
   * Keep WHT configurable for project use.
   */
  withholdingTaxRate: 0.10,
};

const round2 = (value: number): number => {
  return Math.round(value * 100) / 100;
};

const sumAmounts = (
  transactions: TaxTransaction[],
  predicate: (tx: TaxTransaction) => boolean
): number => {
  return round2(
    transactions
      .filter(predicate)
      .reduce((sum, tx) => sum + Number(tx.amount || 0), 0)
  );
};

const calculateProgressiveTax = (
  taxableIncome: number,
  bands: PersonalTaxBand[]
): number => {
  if (taxableIncome <= 0) return 0;

  let remaining = taxableIncome;
  let previousUpper = 0;
  let totalTax = 0;

  for (const band of bands) {
    if (remaining <= 0) break;

    if (band.upperLimit === null) {
      totalTax += remaining * band.rate;
      break;
    }

    const bandWidth = band.upperLimit - previousUpper;
    const taxableInBand = Math.min(remaining, bandWidth);

    if (taxableInBand > 0) {
      totalTax += taxableInBand * band.rate;
      remaining -= taxableInBand;
    }

    previousUpper = band.upperLimit;
  }

  return round2(totalTax);
};

const calculateIndividualTax = (
  transactions: TaxTransaction[]
): IndividualTaxBreakdown => {
  const grossIncome = sumAmounts(
    transactions,
    (tx) =>
      tx.direction === "inflow" &&
      ["Salary", "OtherIncome"].includes(tx.category || "")
  );

  const deductibleExpenses = sumAmounts(
    transactions,
    (tx) =>
      tx.direction === "outflow" &&
      ["DeductibleExpense", "PAYE"].includes(tx.category || "")
  );

  const taxableIncomeBeforeReliefs = grossIncome;

  const consolidatedRelief = round2(
    config.consolidatedReliefBase +
      grossIncome * config.consolidatedReliefRate
  );

  const taxableIncomeAfterReliefs = round2(
    Math.max(
      0,
      taxableIncomeBeforeReliefs - consolidatedRelief - deductibleExpenses
    )
  );

  const estimatedTax = calculateProgressiveTax(
    taxableIncomeAfterReliefs,
    config.personalTaxBands
  );

  return {
    grossIncome: round2(grossIncome),
    taxableIncomeBeforeReliefs: round2(taxableIncomeBeforeReliefs),
    consolidatedRelief,
    deductibleExpenses: round2(deductibleExpenses),
    taxableIncomeAfterReliefs,
    estimatedTax,
  };
};

const calculateBusinessTax = (
  userType: "sme" | "company",
  transactions: TaxTransaction[]
): BusinessTaxBreakdown => {
  const revenue = sumAmounts(
    transactions,
    (tx) =>
      tx.direction === "inflow" &&
      ["Revenue", "OtherIncome"].includes(
        tx.category || ""
      )
  );

  const expenses = sumAmounts(
    transactions,
    (tx) =>
      tx.direction === "outflow" &&
      [
        "BusinessExpense",
        "InventoryPurchase",
        "AssetPurchase",
      ].includes(tx.category || "")
  );

  const payroll = sumAmounts(
    transactions,
    (tx) => tx.direction === "outflow" && tx.category === "Payroll"
  );

  const taxPayments = sumAmounts(
    transactions,
    (tx) =>
      tx.direction === "outflow" &&
      ["TaxPayment", "CorporateTax", "VAT", "WithholdingTax"].includes(
        tx.category || ""
      )
  );

  const netProfit = round2(revenue - expenses - payroll);

  /**
   * Simplified business tax logic for project purposes:
   * - SME: use same "mediumOrLargeRate" as a configurable estimate for now
   * - Company: use company rate directly
   * You can split SME more finely later if you want.
   */
  const companyRate =
    userType === "company"
      ? config.companyIncomeTax.mediumOrLargeRate
      : config.companyIncomeTax.mediumOrLargeRate;

  const estimatedCompanyIncomeTax = round2(
    Math.max(0, netProfit) * companyRate
  );

  /**
   * Simplified VAT estimate:
   * take VAT-like revenue categories as proxy base if available,
   * otherwise use total revenue as a rough project estimate.
   */
  const vatBase = revenue;
  const estimatedVat = round2(Math.max(0, vatBase) * config.vatRate);

  /**
   * Simplified WHT estimate:
   * use business inflows as broad proxy, configurable later.
   */
  const whtBase = revenue;
  const estimatedWithholdingTax = round2(
    Math.max(0, whtBase) * config.withholdingTaxRate
  );

  return {
    revenue,
    expenses,
    payroll,
    taxPayments,
    netProfit,
    estimatedCompanyIncomeTax,
    estimatedVat,
    estimatedWithholdingTax,
  };
};

export const calculateTax = (
  userType: PortalType,
  transactions: TaxTransaction[]
): TaxEngineResult => {
  const totalInflows = sumAmounts(
    transactions,
    (tx) => tx.direction === "inflow"
  );

  const totalOutflows = sumAmounts(
    transactions,
    (tx) => tx.direction === "outflow"
  );

  if (userType === "individual") {
    return {
      userType,
      totals: {
        totalInflows,
        totalOutflows,
      },
      individual: calculateIndividualTax(transactions),
    };
  }

  if (userType === "sme" || userType === "company") {
    return {
      userType,
      totals: {
        totalInflows,
        totalOutflows,
      },
      business: calculateBusinessTax(userType, transactions),
    };
  }

  return {
    userType,
    totals: {
      totalInflows,
      totalOutflows,
    },
  };
};
