import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import xlsx from "xlsx";

export type ParsedRawRow = {
  raw_date?: string;
  raw_description?: string;
  raw_amount?: string;
  raw_debit?: string;
  raw_credit?: string;
  raw_balance?: string;
  raw_json: Record<string, unknown>;
};

export const parseFile = (filePath: string): ParsedRawRow[] => {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".csv") {
    const content = fs.readFileSync(filePath, "utf-8");

    const records = parse(content, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, unknown>[];

    return records.map((row) => ({
      raw_date: String(row.Date ?? row.date ?? ""),
      raw_description: String(
        row.Description ?? row.description ?? row.Narration ?? row.narration ?? ""
      ),
      raw_amount: String(row.Amount ?? row.amount ?? ""),
      raw_debit: String(row.Debit ?? row.debit ?? ""),
      raw_credit: String(row.Credit ?? row.credit ?? ""),
      raw_balance: String(row.Balance ?? row.balance ?? ""),
      raw_json: row,
    }));
  }

  if (ext === ".xlsx" || ext === ".xls") {
    const workbook = xlsx.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];

    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet);

    return rows.map((row) => ({
      raw_date: String(row.Date ?? row.date ?? ""),
      raw_description: String(
        row.Description ?? row.description ?? row.Narration ?? row.narration ?? ""
      ),
      raw_amount: String(row.Amount ?? row.amount ?? ""),
      raw_debit: String(row.Debit ?? row.debit ?? ""),
      raw_credit: String(row.Credit ?? row.credit ?? ""),
      raw_balance: String(row.Balance ?? row.balance ?? ""),
      raw_json: row,
    }));
  }

  throw new Error("Unsupported file type for parsing");
};