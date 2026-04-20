import fs from "fs";
import path from "path";
import { parse as parseCsv } from "csv-parse/sync";
import * as XLSX from "xlsx";
import { mapRawRow, type MappedRawRow } from "./columnMapper.js";
import { parsePdfFile } from "./pdfParser.js";
import { runOcrOnImage } from "./ocrService.js";
import { detectFileType, type DetectedFileType } from "./fileTypeDetector.js";

export type ParsedStatementResult = {
  rows: MappedRawRow[];
  extractedText: string;
  sourceBank: string | null;
  warnings: string[];
};

type ParseFileInput = {
  filePath: string;
  fileType?: DetectedFileType;
  originalName?: string;
};

const BANK_PATTERNS: Array<{ bank: string; patterns: RegExp[] }> = [
  {
    bank: "GTBank",
    patterns: [/gtbank/i, /guaranty trust/i, /\bgtb\b/i],
  },
  {
    bank: "Access Bank",
    patterns: [/access bank/i, /\baccess\b/i],
  },
  {
    bank: "UBA",
    patterns: [/\buba\b/i, /united bank for africa/i],
  },
  {
    bank: "FirstBank",
    patterns: [/firstbank/i, /first bank of nigeria/i],
  },
  {
    bank: "Zenith Bank",
    patterns: [/zenith bank/i, /\bzenith\b/i],
  },
  {
    bank: "Moniepoint",
    patterns: [/moniepoint/i],
  },
  {
    bank: "OPay",
    patterns: [/\bopay\b/i],
  },
];

const DATE_PATTERN =
  /\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2}|\d{1,2}\s+[A-Za-z]{3,9}\s+\d{2,4})\b/i;

const AMOUNT_PATTERN =
  /(?:-?\(?\s*(?:NGN|N|₦)?\s*\d[\d,]*\.\d{2}\)?(?:\s*(?:CR|DR))?)/gi;

const DEBIT_KEYWORDS =
  /\b(dr|debit|withdrawal|pos|atm|charge|charges|fee|fees|transfer to|payment to|purchase|bills?)\b/i;

const CREDIT_KEYWORDS =
  /\b(cr|credit|deposit|salary|received|payment from|transfer from|reversal)\b/i;

const NOISE_PATTERNS = [
  /^date\s+/i,
  /^transaction date/i,
  /^page \d+/i,
  /^opening balance/i,
  /^closing balance/i,
  /^available balance/i,
  /^statement period/i,
  /^generated on/i,
  /^account name/i,
  /^account number/i,
  /^description\s+/i,
];

const normalizeWhitespace = (value: string): string => {
  return value.replace(/\r/g, "").replace(/[ \t]+/g, " ").trim();
};

const detectSourceBank = (...values: Array<string | undefined>): string | null => {
  const haystack = values.filter(Boolean).join(" ");

  for (const entry of BANK_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(haystack))) {
      return entry.bank;
    }
  }

  return null;
};

const isMeaningfulMappedRow = (row: MappedRawRow): boolean => {
  return Boolean(
    row.raw_description ||
      row.raw_date ||
      row.raw_amount ||
      row.raw_debit ||
      row.raw_credit
  );
};

const parseMoneyValue = (value: string): number | null => {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const negative = trimmed.includes("(") || trimmed.includes("-") || /\bDR\b/i.test(trimmed);
  const cleaned = trimmed
    .replace(/\b(?:NGN|CR|DR|N)\b/gi, "")
    .replace(/₦/g, "")
    .replace(/[(),\s]/g, "");

  if (!cleaned) {
    return null;
  }

  const amount = Number(cleaned);

  if (!Number.isFinite(amount)) {
    return null;
  }

  return negative ? -Math.abs(amount) : amount;
};

const formatMoney = (value: number): string => {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const toUnsignedMoneyString = (value: string): string | undefined => {
  const amount = parseMoneyValue(value);

  if (amount === null) {
    return undefined;
  }

  return formatMoney(Math.abs(amount));
};

const toSignedMoneyString = (value: string, line: string): string | undefined => {
  const parsed = parseMoneyValue(value);

  if (parsed === null) {
    return undefined;
  }

  const shouldForceOutflow =
    parsed < 0 || /\bDR\b/i.test(value) || DEBIT_KEYWORDS.test(line);
  const shouldForceInflow = /\bCR\b/i.test(value) || CREDIT_KEYWORDS.test(line);

  if (shouldForceOutflow) {
    return formatMoney(-Math.abs(parsed));
  }

  if (shouldForceInflow) {
    return formatMoney(Math.abs(parsed));
  }

  return formatMoney(parsed);
};

const extractAmounts = (line: string): string[] => {
  return Array.from(line.matchAll(AMOUNT_PATTERN), (match) => match[0].trim()).filter(Boolean);
};

const cleanDescription = (value: string): string => {
  return value
    .replace(/\b(?:CR|DR)\b/gi, " ")
    .replace(/\s+/g, " ")
    .replace(/[|]/g, " ")
    .trim();
};

const parseStructuredRows = (records: Record<string, unknown>[]): MappedRawRow[] => {
  return records.map((row) => mapRawRow(row)).filter(isMeaningfulMappedRow);
};

const parseCsvRows = (filePath: string): MappedRawRow[] => {
  const fileContent = fs.readFileSync(filePath, "utf8");

  const records = parseCsv(fileContent, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, unknown>[];

  return parseStructuredRows(records);
};

const parseWorkbookRows = (filePath: string): MappedRawRow[] => {
  const workbook = XLSX.readFile(filePath, {
    cellDates: false,
    raw: false,
  });

  const rows = workbook.SheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });
  });

  return parseStructuredRows(rows);
};

const isNoiseLine = (line: string): boolean => {
  return NOISE_PATTERNS.some((pattern) => pattern.test(line));
};

const buildLogicalLines = (lines: string[]): string[] => {
  const merged: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const current = normalizeWhitespace(lines[index] || "");

    if (!current || isNoiseLine(current)) {
      continue;
    }

    const hasDate = DATE_PATTERN.test(current);
    const hasAmount = extractAmounts(current).length > 0;
    const next = normalizeWhitespace(lines[index + 1] || "");

    if (hasDate && !hasAmount && next && !DATE_PATTERN.test(next)) {
      merged.push(`${current} ${next}`);
      index += 1;
      continue;
    }

    if (!hasDate && merged.length > 0 && extractAmounts(current).length > 0) {
      const previous = merged[merged.length - 1];

      if (DATE_PATTERN.test(previous) && extractAmounts(previous).length === 0) {
        merged[merged.length - 1] = `${previous} ${current}`;
        continue;
      }
    }

    merged.push(current);
  }

  return merged;
};

const parseTransactionLine = (line: string): MappedRawRow | null => {
  if (!DATE_PATTERN.test(line)) {
    return null;
  }

  const dateMatch = line.match(DATE_PATTERN);
  const amounts = extractAmounts(line);

  if (!dateMatch || amounts.length === 0) {
    return null;
  }

  let description = line.replace(dateMatch[0], " ");

  for (const amount of amounts) {
    description = description.replace(amount, " ");
  }

  description = cleanDescription(description);

  if (!description) {
    description = "Parsed bank transaction";
  }

  const row: MappedRawRow = {
    raw_date: dateMatch[0],
    raw_description: description,
    raw_json: {
      rawLine: line,
      amountTokens: amounts,
    },
  };

  if (amounts.length >= 3) {
    row.raw_debit = toUnsignedMoneyString(amounts[0]);
    row.raw_credit = toUnsignedMoneyString(amounts[1]);
    row.raw_balance = toUnsignedMoneyString(amounts[2]);
    return isMeaningfulMappedRow(row) ? row : null;
  }

  if (amounts.length === 2) {
    row.raw_balance = toUnsignedMoneyString(amounts[1]);

    if (CREDIT_KEYWORDS.test(line) && !DEBIT_KEYWORDS.test(line)) {
      row.raw_credit = toUnsignedMoneyString(amounts[0]);
    } else if (DEBIT_KEYWORDS.test(line) && !CREDIT_KEYWORDS.test(line)) {
      row.raw_debit = toUnsignedMoneyString(amounts[0]);
    } else {
      row.raw_amount = toSignedMoneyString(amounts[0], line);
    }

    return isMeaningfulMappedRow(row) ? row : null;
  }

  row.raw_amount = toSignedMoneyString(amounts[0], line);

  return isMeaningfulMappedRow(row) ? row : null;
};

const BLOCK_START_PATTERN = /^\d{2}\/\d{2}\/\d{4}\b/;
const TABULAR_TAIL_PATTERN =
  /\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+(\d{2}\/\d{2}\/\d{4})\s+([\d,]+\.\d{2})$/;

const buildTransactionBlocks = (lines: string[]): string[] => {
  const blocks: string[] = [];
  let currentBlock: string[] = [];

  for (const rawLine of lines) {
    const line = normalizeWhitespace(rawLine);

    if (!line || isNoiseLine(line)) {
      continue;
    }

    if (/^opening balance/i.test(line) || /^closing balance/i.test(line)) {
      continue;
    }

    if (BLOCK_START_PATTERN.test(line)) {
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join(" "));
      }

      currentBlock = [line];
      continue;
    }

    if (currentBlock.length > 0) {
      currentBlock.push(line);
    }
  }

  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join(" "));
  }

  return blocks;
};

const parseTabularTransactionBlock = (block: string): MappedRawRow | null => {
  const blockStart = block.match(BLOCK_START_PATTERN);
  const tail = block.match(TABULAR_TAIL_PATTERN);

  if (!blockStart || !tail || tail.index === undefined) {
    return null;
  }

  const postingDate = blockStart[0];
  const description = cleanDescription(
    block.slice(postingDate.length, tail.index).trim()
  );

  return {
    raw_date: postingDate,
    raw_description: description || "Parsed bank transaction",
    raw_debit: tail[1],
    raw_credit: tail[2],
    raw_balance: tail[4],
    raw_json: {
      rawLine: block,
      valueDate: tail[3],
    },
  };
};

const parseTabularStatementRows = (lines: string[]): MappedRawRow[] => {
  return buildTransactionBlocks(lines)
    .map((block) => parseTabularTransactionBlock(block))
    .filter((row): row is MappedRawRow => row !== null);
};

const parseTextStatementRows = (lines: string[]): MappedRawRow[] => {
  const tabularRows = parseTabularStatementRows(lines);

  if (tabularRows.length > 0) {
    return tabularRows;
  }

  return buildLogicalLines(lines)
    .map((line) => parseTransactionLine(line))
    .filter((row): row is MappedRawRow => row !== null);
};

const assertParsedRows = (rows: MappedRawRow[]): void => {
  if (rows.length === 0) {
    throw new Error(
      "We could not detect transaction rows in this statement. Try a cleaner PDF/image or export the statement as CSV/XLSX."
    );
  }
};

export const parseFile = async ({
  filePath,
  fileType,
  originalName,
}: ParseFileInput): Promise<ParsedStatementResult> => {
  const detected = fileType
    ? { fileType, sourceFormat: "unknown" }
    : detectFileType("application/octet-stream", originalName || filePath);

  const warnings: string[] = [];
  const resolvedType = detected.fileType;
  const sourceBank = detectSourceBank(originalName, path.basename(filePath));

  if (resolvedType === "csv") {
    const rows = parseCsvRows(filePath);
    assertParsedRows(rows);

    return {
      rows,
      extractedText: "",
      sourceBank,
      warnings,
    };
  }

  if (resolvedType === "xlsx") {
    const rows = parseWorkbookRows(filePath);
    assertParsedRows(rows);

    return {
      rows,
      extractedText: "",
      sourceBank,
      warnings,
    };
  }

  if (resolvedType === "pdf") {
    const pdfResult = await parsePdfFile(filePath);
    const rows = parseTextStatementRows(pdfResult.lines);
    const detectedBank = detectSourceBank(pdfResult.extractedText, originalName, path.basename(filePath));

    assertParsedRows(rows);

    warnings.push(
      "PDF statements are parsed with text heuristics. If some rows are missed, try exporting the same statement as CSV or Excel."
    );

    return {
      rows,
      extractedText: pdfResult.extractedText,
      sourceBank: detectedBank || sourceBank,
      warnings,
    };
  }

  if (resolvedType === "image") {
    const ocrResult = await runOcrOnImage(filePath);
    const rows = parseTextStatementRows(ocrResult.lines);
    const detectedBank = detectSourceBank(ocrResult.extractedText, originalName, path.basename(filePath));

    assertParsedRows(rows);

    warnings.push(
      "Image statements are parsed with OCR, so a clearer screenshot usually gives better results."
    );

    return {
      rows,
      extractedText: ocrResult.extractedText,
      sourceBank: detectedBank || sourceBank,
      warnings,
    };
  }

  throw new Error("Unsupported file type. Upload PDF, CSV, Excel, or image.");
};
