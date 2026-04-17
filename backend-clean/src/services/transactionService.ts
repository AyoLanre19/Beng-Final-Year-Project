import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import type { NormalizedTransaction } from "./transactionNormalizer.js";

type SaveTransactionsInput = {
  userId: string;
  documentId: string;
  sourceType: string;
  sourceBank?: string | null;
  transactions: NormalizedTransaction[];
};

export const saveTransactions = async ({
  userId,
  documentId,
  sourceType,
  sourceBank,
  transactions,
}: SaveTransactionsInput): Promise<void> => {
  for (const tx of transactions) {
    await pool.query(
      `INSERT INTO transactions (
        id,
        user_id,
        document_id,
        transaction_date,
        description,
        amount,
        direction,
        category,
        confidence,
        source_type,
        source_bank,
        is_user_edited
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        randomUUID(),
        userId,
        documentId,
        tx.transaction_date,
        tx.description,
        tx.amount,
        tx.direction,
        tx.category,
        tx.confidence,
        sourceType,
        sourceBank ?? null,
        false,
      ]
    );
  }
};