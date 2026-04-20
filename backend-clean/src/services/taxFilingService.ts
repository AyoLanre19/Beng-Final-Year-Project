import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import type { PortalType } from "./portalRules.js";

type FilingBreakdownItem = {
  label?: unknown;
  amount?: unknown;
  basis?: unknown;
  rate?: unknown;
  note?: unknown;
};

type StoredTaxFilingInput = {
  userId: string;
  userType: PortalType;
  taxPeriod: string;
  totalIncome: number;
  totalExpenses: number;
  totalTax: number;
  vatAmount: number;
  withholdingAmount: number;
  breakdown: unknown[];
  filingData: Record<string, unknown>;
};

export type StoredTaxFiling = StoredTaxFilingInput & {
  filingId: string;
  referenceNumber: string;
  createdAt: string;
};

export type FilingListItem = {
  filingId: string;
  userId: string;
  userType: PortalType;
  referenceNumber: string;
  taxPeriod: string;
  totalIncome: number;
  totalExpenses: number;
  totalTax: number;
  filingStatus: string;
  submittedAt: string | null;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

const safeText = (value: unknown): string => {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/[^\x20-\x7E]/g, " ").trim();
};

const formatCurrency = (value: number): string => `NGN ${round2(value).toLocaleString("en-NG")}`;

const escapePdfText = (value: string): string => {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
};

const buildPdfBuffer = (lines: string[]): Buffer => {
  const textCommands = lines
    .map((line, index) => {
      const y = 760 - index * 18;
      return `1 0 0 1 50 ${y} Tm (${escapePdfText(line)}) Tj`;
    })
    .join("\n");

  const streamContent = `BT
/F1 12 Tf
${textCommands}
ET`;

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, "utf8")} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (const object of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  }

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref
0 ${objects.length + 1}
0000000000 65535 f 
`;

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer
<< /Size ${objects.length + 1} /Root 1 0 R >>
startxref
${xrefOffset}
%%EOF`;

  return Buffer.from(pdf, "utf8");
};

export const storeTaxFiling = async (
  input: StoredTaxFilingInput
): Promise<StoredTaxFiling> => {
  const filingId = randomUUID();
  const createdAt = new Date().toISOString();
  const referenceNumber = `TX-${createdAt.slice(0, 10).replace(/-/g, "")}-${filingId.slice(0, 8).toUpperCase()}`;

  await pool.query(
    `INSERT INTO tax_returns (
       id,
       user_id,
       user_type,
       tax_period,
       total_income,
       total_expenses,
       total_tax,
       vat_amount,
       withholding_amount,
       filing_status,
       reference_number,
       filing_data,
       breakdown,
       submitted_at
     )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12::jsonb,$13::jsonb,$14)`,
    [
      filingId,
      input.userId,
      input.userType,
      input.taxPeriod,
      round2(input.totalIncome),
      round2(input.totalExpenses),
      round2(input.totalTax),
      round2(input.vatAmount),
      round2(input.withholdingAmount),
      "submitted",
      referenceNumber,
      JSON.stringify(input.filingData || {}),
      JSON.stringify(input.breakdown || []),
      createdAt,
    ]
  );

  return {
    ...input,
    filingId,
    referenceNumber,
    createdAt,
  };
};

export const getStoredTaxFiling = async (
  filingId: string
): Promise<StoredTaxFiling | null> => {
  const result = await pool.query(
    `SELECT
       id,
       user_id,
       user_type,
       tax_period,
       total_income,
       total_expenses,
       total_tax,
       vat_amount,
       withholding_amount,
       breakdown,
       filing_data,
       submitted_at,
       reference_number
     FROM tax_returns
     WHERE id = $1`,
    [filingId]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  return {
    filingId: row.id,
    userId: row.user_id,
    userType: row.user_type,
    taxPeriod: row.tax_period,
    totalIncome: Number(row.total_income),
    totalExpenses: Number(row.total_expenses),
    totalTax: Number(row.total_tax),
    vatAmount: Number(row.vat_amount),
    withholdingAmount: Number(row.withholding_amount),
    breakdown: Array.isArray(row.breakdown) ? row.breakdown : [],
    filingData:
      row.filing_data && typeof row.filing_data === "object"
        ? row.filing_data
        : {},
    referenceNumber: row.reference_number,
    createdAt: row.submitted_at || new Date().toISOString(),
  };
};

export const listTaxFilings = async (limit = 50): Promise<FilingListItem[]> => {
  const result = await pool.query(
    `SELECT
       id,
       user_id,
       user_type,
       tax_period,
       total_income,
       total_expenses,
       total_tax,
       filing_status,
       reference_number,
       submitted_at
     FROM tax_returns
     ORDER BY submitted_at DESC NULLS LAST, id DESC
     LIMIT $1`,
    [limit]
  );

  return result.rows.map((row) => ({
    filingId: row.id,
    userId: row.user_id,
    userType: row.user_type,
    referenceNumber: row.reference_number,
    taxPeriod: row.tax_period,
    totalIncome: Number(row.total_income),
    totalExpenses: Number(row.total_expenses),
    totalTax: Number(row.total_tax),
    filingStatus: row.filing_status,
    submittedAt: row.submitted_at,
  }));
};

export const buildTaxFilingPdf = (filing: StoredTaxFiling): Buffer => {
  const breakdownLines = filing.breakdown
    .slice(0, 8)
    .map((item, index) => {
      const row = item as FilingBreakdownItem;
      const label = safeText(row.label) || `Line ${index + 1}`;
      const amount =
        typeof row.amount === "number" || typeof row.amount === "string"
          ? formatCurrency(Number(row.amount) || 0)
          : formatCurrency(0);
      return `${label}: ${amount}`;
    });

  const lines = [
    "Tax Filing Summary",
    `Reference Number: ${filing.referenceNumber}`,
    `User Type: ${filing.userType.toUpperCase()}`,
    `Tax Period: ${safeText(filing.taxPeriod)}`,
    `Created At: ${safeText(filing.createdAt)}`,
    "",
    `Total Income: ${formatCurrency(filing.totalIncome)}`,
    `Total Expenses: ${formatCurrency(filing.totalExpenses)}`,
    `Total Tax: ${formatCurrency(filing.totalTax)}`,
    `VAT Amount: ${formatCurrency(filing.vatAmount)}`,
    `Withholding Amount: ${formatCurrency(filing.withholdingAmount)}`,
    "",
    "Breakdown:",
    ...breakdownLines,
  ];

  return buildPdfBuffer(lines);
};
