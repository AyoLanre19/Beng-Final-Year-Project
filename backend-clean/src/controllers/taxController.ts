import { Response } from "express";
import { pool } from "../config/db.js";
import { calculateTax, type TaxTransaction } from "../services/taxEngine.js";
import { buildTaxFilingPdf, getStoredTaxFiling, storeTaxFiling } from "../services/taxFilingService.js";
import type { PortalType } from "../services/portalRules.js";
import { type AuthenticatedRequest } from "../middleware/auth.js";

type TaxBreakdownItem = {
  label: string;
  amount: number;
  basis?: string;
  rate?: number;
  note?: string;
};

type TaxCalculationResult = {
  userType: PortalType;
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
};

type TransactionRow = Record<string, unknown>;
type LoadedTaxTransaction = TaxTransaction & {
  transactionDate: string | null;
};
type ProjectionMeta = {
  monthsObserved: number;
  annualizationFactor: number;
  periodStart: string | null;
  periodEnd: string | null;
  projectionNote: string;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

const toStringOrNull = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeUserType = (value: unknown): PortalType => {
  if (value === "individual" || value === "sme" || value === "company") {
    return value;
  }

  return "individual";
};

const uniqueMonthCount = (transactions: LoadedTaxTransaction[]): number => {
  const months = new Set(
    transactions
      .map((transaction) => transaction.transactionDate?.slice(0, 7))
      .filter((value): value is string => Boolean(value))
  );

  return Math.max(1, months.size);
};

const buildProjectionMeta = (
  transactions: LoadedTaxTransaction[]
): ProjectionMeta => {
  const datedTransactions = transactions
    .map((transaction) => transaction.transactionDate)
    .filter((value): value is string => Boolean(value))
    .sort();

  const monthsObserved = uniqueMonthCount(transactions);
  const annualizationFactor = round2(12 / monthsObserved);
  const periodStart = datedTransactions[0] ?? null;
  const periodEnd = datedTransactions[datedTransactions.length - 1] ?? null;
  const periodRange =
    periodStart && periodEnd && periodStart !== periodEnd
      ? ` from ${periodStart} to ${periodEnd}`
      : periodStart
        ? ` for ${periodStart}`
        : "";

  return {
    monthsObserved,
    annualizationFactor,
    periodStart,
    periodEnd,
    projectionNote: `This is an annualized forecast built from ${monthsObserved} month(s) of uploaded transactions${periodRange}. Final tax filing should still be checked against full-year records.`,
  };
};

const toEngineTransactions = (
  transactions: LoadedTaxTransaction[]
): TaxTransaction[] => {
  return transactions.map(({ transactionDate: _transactionDate, ...transaction }) => transaction);
};

const annualizeTransactions = (
  transactions: LoadedTaxTransaction[],
  annualizationFactor: number
): TaxTransaction[] => {
  return transactions.map(({ transactionDate: _transactionDate, ...transaction }) => ({
    ...transaction,
    amount: round2(transaction.amount * annualizationFactor),
  }));
};

const sumCategoryAmounts = (
  transactions: TaxTransaction[],
  direction: "inflow" | "outflow",
  categories: string[]
): number => {
  return round2(
    transactions
      .filter((tx) => tx.direction === direction && categories.includes(tx.category || ""))
      .reduce((sum, tx) => sum + tx.amount, 0)
  );
};

const getLawReferences = (userType: PortalType): string[] => {
  if (userType === "individual") {
    return [
      "Personal Income Tax Act (PITA): progressive tax bands and consolidated relief.",
      "PAYE records are treated as prior personal tax payments where detected.",
      "Only transactions classified as taxable income or deductible expense are included in this forecast.",
      "Transfers are excluded from the core taxable-income base unless later confirmed as income.",
      "This dashboard annualizes the observed statement period to estimate a likely full-year position.",
    ];
  }

  return [
    "Companies Income Tax Act (CITA): estimated company income tax applied to positive net profit.",
    "Value Added Tax (VAT) Act: VAT estimated from detected business inflows.",
    "Withholding Tax estimate is calculated from relevant business inflows using project assumptions.",
    "Transfers and loan flows are excluded from the core taxable revenue base where possible.",
    "This dashboard annualizes the observed statement period to estimate a likely full-year position.",
  ];
};

const getWarnings = (
  userType: PortalType,
  transactions: LoadedTaxTransaction[],
  projectionMeta: ProjectionMeta,
  payeAlreadyPaid: number,
  totalTax: number
): string[] => {
  const warnings: string[] = [];

  if (transactions.length === 0) {
    warnings.push("No uploaded transactions were found for this user. Upload a bank statement to improve the estimate.");
  }

  warnings.push(projectionMeta.projectionNote);

  if (projectionMeta.monthsObserved === 1) {
    warnings.push("A single month can be unusually high or low, so treat this as a forecast rather than a final yearly tax answer.");
  }

  if (userType === "individual" && payeAlreadyPaid === 0) {
    warnings.push("No PAYE payment was detected from the uploaded transactions.");
  }

  if (userType !== "individual" && totalTax === 0) {
    warnings.push("No business tax liability was detected from the uploaded transactions.");
  }

  if (
    transactions.some((transaction) =>
      ["TransferIn", "TransferOut", "LoanInflow", "LoanRepayment"].includes(
        transaction.category || ""
      )
    )
  ) {
    warnings.push("Transfers and loan movements were kept out of the main taxable base where possible, but they should still be reviewed manually.");
  }

  return warnings;
};

const buildTaxCalculationResult = (
  userType: PortalType,
  transactions: LoadedTaxTransaction[]
): TaxCalculationResult => {
  const projectionMeta = buildProjectionMeta(transactions);
  const observedTransactions = toEngineTransactions(transactions);
  const annualizedTransactions = annualizeTransactions(
    transactions,
    projectionMeta.annualizationFactor
  );
  const observedTaxSummary = calculateTax(userType, observedTransactions);
  const taxSummary = calculateTax(userType, annualizedTransactions);

  if (userType === "individual" && taxSummary.individual) {
    const individual = taxSummary.individual;
    const observedIndividual = observedTaxSummary.individual ?? {
      grossIncome: 0,
      taxableIncomeBeforeReliefs: 0,
      consolidatedRelief: 0,
      deductibleExpenses: 0,
      taxableIncomeAfterReliefs: 0,
      estimatedTax: 0,
    };
    const payeAlreadyPaid = sumCategoryAmounts(annualizedTransactions, "outflow", ["PAYE"]);
    const overpayment = round2(Math.max(0, payeAlreadyPaid - individual.estimatedTax));
    const underpayment = round2(Math.max(0, individual.estimatedTax - payeAlreadyPaid));
    const monthlyTaxEstimate = round2(individual.estimatedTax / 12);

    return {
      userType,
      calculationMode: "annualized_forecast",
      projectionNote: projectionMeta.projectionNote,
      monthsObserved: projectionMeta.monthsObserved,
      annualizationFactor: projectionMeta.annualizationFactor,
      periodStart: projectionMeta.periodStart,
      periodEnd: projectionMeta.periodEnd,
      observedPeriodIncome: observedIndividual.grossIncome,
      observedPeriodExpenses: observedIndividual.deductibleExpenses,
      observedPeriodNet: round2(
        observedIndividual.grossIncome - observedIndividual.deductibleExpenses
      ),
      monthlyTaxEstimate,
      annualTaxForecast: individual.estimatedTax,
      grossIncome: individual.grossIncome,
      totalIncome: individual.grossIncome,
      totalExpenses: individual.deductibleExpenses,
      netProfit: round2(individual.grossIncome - individual.deductibleExpenses),
      reliefAmount: individual.consolidatedRelief,
      taxableIncome: individual.taxableIncomeAfterReliefs,
      totalTax: individual.estimatedTax,
      vatAmount: 0,
      withholdingAmount: 0,
      payeAlreadyPaid,
      overpayment,
      underpayment,
      effectiveTaxRate: individual.grossIncome > 0 ? round2(individual.estimatedTax / individual.grossIncome) : 0,
      breakdown: [
        {
          label: "Observed Statement Income",
          amount: observedIndividual.grossIncome,
          basis: `Detected taxable inflows across ${projectionMeta.monthsObserved} observed month(s). Transfers are excluded from the core income base.`,
        },
        {
          label: "Projected Annual Income",
          amount: individual.grossIncome,
          basis: `Annualized from the uploaded statement period using a factor of ${projectionMeta.annualizationFactor}.`,
        },
        {
          label: "Projected Annual Consolidated Relief",
          amount: individual.consolidatedRelief,
          basis: "Forecast using the configured project relief rule on annualized taxable income.",
        },
        {
          label: "Projected Annual Deductible Expenses",
          amount: individual.deductibleExpenses,
          basis: "Annualized deductible expenses and PAYE-like entries from the observed statement period.",
        },
        {
          label: "Projected Annual Taxable Income",
          amount: individual.taxableIncomeAfterReliefs,
          basis: "Annualized income remaining after projected reliefs and deductible items.",
        },
        {
          label: "Projected Annual Personal Income Tax",
          amount: individual.estimatedTax,
          basis: "Calculated using the configured progressive personal tax bands on the annualized forecast.",
        },
        {
          label: "Estimated Monthly Tax",
          amount: monthlyTaxEstimate,
          note: "Annual tax forecast divided across 12 months for planning purposes.",
        },
        {
          label: "Projected Annual PAYE Already Paid",
          amount: payeAlreadyPaid,
          note: "Annualized from detected PAYE entries and used to estimate projected overpayment or underpayment.",
        },
      ],
      warnings: getWarnings(
        userType,
        transactions,
        projectionMeta,
        payeAlreadyPaid,
        individual.estimatedTax
      ),
      lawReferences: getLawReferences(userType),
    };
  }

  const business = taxSummary.business ?? {
    revenue: 0,
    expenses: 0,
    payroll: 0,
    taxPayments: 0,
    netProfit: 0,
    estimatedCompanyIncomeTax: 0,
    estimatedVat: 0,
    estimatedWithholdingTax: 0,
  };
  const observedBusiness = observedTaxSummary.business ?? {
    revenue: 0,
    expenses: 0,
    payroll: 0,
    taxPayments: 0,
    netProfit: 0,
    estimatedCompanyIncomeTax: 0,
    estimatedVat: 0,
    estimatedWithholdingTax: 0,
  };

  const totalTax = round2(
    business.estimatedCompanyIncomeTax +
      business.estimatedVat +
      business.estimatedWithholdingTax
  );
  const projectedTaxPayments = round2(
    observedBusiness.taxPayments * projectionMeta.annualizationFactor
  );
  const overpayment = round2(Math.max(0, business.taxPayments - totalTax));
  const underpayment = round2(Math.max(0, totalTax - projectedTaxPayments));
  const monthlyTaxEstimate = round2(totalTax / 12);

  return {
    userType,
    calculationMode: "annualized_forecast",
    projectionNote: projectionMeta.projectionNote,
    monthsObserved: projectionMeta.monthsObserved,
    annualizationFactor: projectionMeta.annualizationFactor,
    periodStart: projectionMeta.periodStart,
    periodEnd: projectionMeta.periodEnd,
    observedPeriodIncome: observedBusiness.revenue,
    observedPeriodExpenses: round2(observedBusiness.expenses + observedBusiness.payroll),
    observedPeriodNet: observedBusiness.netProfit,
    monthlyTaxEstimate,
    annualTaxForecast: totalTax,
    grossIncome: business.revenue,
    totalIncome: business.revenue,
    totalExpenses: round2(business.expenses + business.payroll),
    netProfit: business.netProfit,
    reliefAmount: 0,
    taxableIncome: Math.max(0, business.netProfit),
    totalTax,
    vatAmount: business.estimatedVat,
    withholdingAmount: business.estimatedWithholdingTax,
    payeAlreadyPaid: 0,
    overpayment: round2(Math.max(0, projectedTaxPayments - totalTax)),
    underpayment,
    effectiveTaxRate: business.revenue > 0 ? round2(totalTax / business.revenue) : 0,
    breakdown: [
      {
        label: "Observed Statement Revenue",
        amount: observedBusiness.revenue,
        basis: `Detected business income across ${projectionMeta.monthsObserved} observed month(s). Transfer and loan inflows are excluded from the core revenue base.`,
      },
      {
        label: "Projected Annual Revenue",
        amount: business.revenue,
        basis: `Annualized from the uploaded statement period using a factor of ${projectionMeta.annualizationFactor}.`,
      },
      {
        label: "Projected Annual Operating Expenses",
        amount: business.expenses,
        basis: "Annualized business expenses from the observed statement period.",
      },
      {
        label: "Projected Annual Payroll",
        amount: business.payroll,
        basis: "Annualized payroll outflows from the observed statement period.",
      },
      {
        label: "Projected Annual Net Profit",
        amount: business.netProfit,
        basis: "Projected annual revenue minus projected annual expenses and payroll.",
      },
      {
        label: "Projected Annual Company Income Tax",
        amount: business.estimatedCompanyIncomeTax,
      },
      {
        label: "Projected Annual VAT",
        amount: business.estimatedVat,
      },
      {
        label: "Projected Annual Withholding Tax",
        amount: business.estimatedWithholdingTax,
      },
      {
        label: "Estimated Monthly Tax",
        amount: monthlyTaxEstimate,
        note: "Annual tax forecast divided across 12 months for planning purposes.",
      },
      {
        label: "Projected Annual Recorded Tax Payments",
        amount: projectedTaxPayments,
        note: "Annualized from the uploaded statement period and used to estimate projected overpayment or underpayment.",
      },
    ],
    warnings: getWarnings(userType, transactions, projectionMeta, 0, totalTax),
    lawReferences: getLawReferences(userType),
  };
};

const loadTransactions = async (userId: string): Promise<LoadedTaxTransaction[]> => {
  const result = await pool.query<TransactionRow>(
    `SELECT *
     FROM transactions
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows
    .map((row) => {
      const description = toStringOrNull(row.description);
      const category =
        toStringOrNull(row.user_category) ||
        toStringOrNull(row.ai_category) ||
        toStringOrNull(row.category);
      const direction = row.direction === "inflow" || row.direction === "outflow" ? row.direction : null;

      if (!description || !direction) {
        return null;
      }

      return {
        description,
        amount: toNumber(row.amount),
        direction,
        category,
        transactionDate: toStringOrNull(row.transaction_date),
      } satisfies LoadedTaxTransaction;
    })
    .filter((row): row is LoadedTaxTransaction => row !== null);
};

const resolveAuthenticatedContext = (req: AuthenticatedRequest) => {
  const userId = req.user?.id;
  const tokenUserType = req.user?.user_type;

  if (!userId || !tokenUserType) {
    throw new Error("Unauthorized");
  }

  const fallbackUserType: PortalType =
    tokenUserType === "individual" ||
    tokenUserType === "sme" ||
    tokenUserType === "company"
      ? tokenUserType
      : "individual";

  const hasRequestedUserType =
    req.body?.userType === "individual" ||
    req.body?.userType === "sme" ||
    req.body?.userType === "company" ||
    req.query.userType === "individual" ||
    req.query.userType === "sme" ||
    req.query.userType === "company";

  const userType = hasRequestedUserType
    ? normalizeUserType(req.body?.userType ?? req.query.userType)
    : fallbackUserType;

  return {
    userId,
    userType,
  };
};

export const getTaxSummary = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, userType } = resolveAuthenticatedContext(req);
    const transactions = await loadTransactions(userId);
    const taxSummary = buildTaxCalculationResult(userType, transactions);

    return res.status(200).json({
      message: "Tax summary generated successfully",
      taxSummary,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to calculate tax";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      message,
    });
  }
};

export const calculateTaxPreview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, userType } = resolveAuthenticatedContext(req);
    const transactions = await loadTransactions(userId);
    const data = buildTaxCalculationResult(userType, transactions);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to calculate tax preview";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const submitTaxFiling = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, userType } = resolveAuthenticatedContext(req);
    const taxPeriod =
      typeof req.body?.taxPeriod === "string" && req.body.taxPeriod.trim().length > 0
        ? req.body.taxPeriod.trim()
        : null;

    if (!taxPeriod) {
      return res.status(400).json({
        success: false,
        message: "taxPeriod is required",
      });
    }

    const submission = await storeTaxFiling({
      userId,
      userType,
      taxPeriod,
      totalIncome: toNumber(req.body?.totalIncome),
      totalExpenses: toNumber(req.body?.totalExpenses),
      totalTax: toNumber(req.body?.totalTax),
      vatAmount: toNumber(req.body?.vatAmount),
      withholdingAmount: toNumber(req.body?.withholdingAmount),
      breakdown: Array.isArray(req.body?.breakdown) ? req.body.breakdown : [],
      filingData:
        typeof req.body?.filingData === "object" && req.body.filingData !== null
          ? req.body.filingData
          : {},
    });

    return res.status(201).json({
      success: true,
      data: {
        success: true,
        referenceNumber: submission.referenceNumber,
        filingId: submission.filingId,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit tax filing";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const downloadTaxFiling = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    resolveAuthenticatedContext(req);

    const filingId =
      typeof req.params.filingId === "string" ? req.params.filingId.trim() : "";

    const filing = await getStoredTaxFiling(filingId);

    if (!filing) {
      return res.status(404).json({
        message: "Filing record not found",
      });
    }

    const pdfBuffer = buildTaxFilingPdf(filing);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="filing-${filing.referenceNumber}.pdf"`
    );

    return res.status(200).send(pdfBuffer);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate filing PDF";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      message,
    });
  }
};
