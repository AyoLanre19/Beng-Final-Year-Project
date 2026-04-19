export type MappedRawRow = {
  raw_date?: string;
  raw_description?: string;
  raw_amount?: string;
  raw_debit?: string;
  raw_credit?: string;
  raw_balance?: string;
  raw_json: Record<string, unknown>;
};

const DATE_KEYS = [
  "date",
  "transaction date",
  "txn date",
  "value date",
  "posting date",
];

const DESCRIPTION_KEYS = [
  "description",
  "narration",
  "details",
  "transaction details",
  "remarks",
  "reference",
];

const AMOUNT_KEYS = [
  "amount",
  "transaction amount",
];

const DEBIT_KEYS = [
  "debit",
  "withdrawal",
  "money out",
];

const CREDIT_KEYS = [
  "credit",
  "deposit",
  "money in",
];

const BALANCE_KEYS = [
  "balance",
  "running balance",
  "available balance",
];

const normalizeKey = (key: string): string => {
  return key.toLowerCase().replace(/\s+/g, " ").trim();
};

const findValueByKeys = (
  row: Record<string, unknown>,
  possibleKeys: string[]
): string | undefined => {
  for (const [key, value] of Object.entries(row)) {
    const normalized = normalizeKey(key);

    if (possibleKeys.includes(normalized)) {
      return value !== undefined && value !== null ? String(value) : undefined;
    }
  }

  return undefined;
};

export const mapRawRow = (row: Record<string, unknown>): MappedRawRow => {
  return {
    raw_date: findValueByKeys(row, DATE_KEYS),
    raw_description: findValueByKeys(row, DESCRIPTION_KEYS),
    raw_amount: findValueByKeys(row, AMOUNT_KEYS),
    raw_debit: findValueByKeys(row, DEBIT_KEYS),
    raw_credit: findValueByKeys(row, CREDIT_KEYS),
    raw_balance: findValueByKeys(row, BALANCE_KEYS),
    raw_json: row,
  };
};