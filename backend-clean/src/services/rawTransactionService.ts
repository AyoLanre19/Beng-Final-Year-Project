import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import type { ParsedRawRow } from "./fileParser.js";

type SaveRawTransactionsInput = {
  documentId: string;
  rows: ParsedRawRow[];
};

export const saveRawTransactions = async ({
  documentId,
  rows,
}: SaveRawTransactionsInput): Promise<void> => {
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];

    await pool.query(
      `INSERT INTO raw_transactions (
        id,
        document_id,
        row_index,
        raw_date,
        raw_description,
        raw_amount,
        raw_debit,
        raw_credit,
        raw_balance,
        raw_json
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        randomUUID(),
        documentId,
        index,
        row.raw_date || null,
        row.raw_description || null,
        row.raw_amount || null,
        row.raw_debit || null,
        row.raw_credit || null,
        row.raw_balance || null,
        row.raw_json,
      ]
    );
  }
};