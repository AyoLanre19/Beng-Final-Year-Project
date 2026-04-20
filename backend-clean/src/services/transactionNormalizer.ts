type RawTransactionRow = {
  raw_date?: string | null;
  raw_description?: string | null;
  raw_amount?: string | null;
  raw_debit?: string | null;
  raw_credit?: string | null;
  raw_balance?: string | null;
};

export type NormalizedTransaction = {
  transaction_date: string | null;
  description: string;
  amount: number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: number | null;
};

const cleanMoney = (value?: string | null): number | null => {
  if (!value) return null;

  const cleaned = value.replace(/,/g, "").replace(/\s/g, "").trim();

  if (!cleaned) return null;

  const parsed = Number(cleaned);

  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeDate = (value?: string | null): string | null => {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, day, month, year] = slashMatch;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const parsed = new Date(trimmed);

  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().split("T")[0];
  }

  return null;
};

const cleanDescription = (value?: string | null): string => {
  if (!value) return "No description";
  return value.replace(/\s+/g, " ").trim();
};

export const normalizeRawTransaction = (
  row: RawTransactionRow
): NormalizedTransaction | null => {
  const rawAmount = cleanMoney(row.raw_amount);
  const rawDebit = cleanMoney(row.raw_debit);
  const rawCredit = cleanMoney(row.raw_credit);

  let amount: number | null = null;
  let direction: "inflow" | "outflow" | null = null;

  if (rawAmount !== null) {
    amount = Math.abs(rawAmount);
    direction = rawAmount >= 0 ? "inflow" : "outflow";
  } else if (rawCredit !== null && rawCredit > 0) {
    amount = rawCredit;
    direction = "inflow";
  } else if (rawDebit !== null && rawDebit > 0) {
    amount = rawDebit;
    direction = "outflow";
  }

  if (amount === null || direction === null) {
    return null;
  }

  return {
    transaction_date: normalizeDate(row.raw_date),
    description: cleanDescription(row.raw_description),
    amount,
    direction,
    category: null,
    confidence: null,
  };
};
