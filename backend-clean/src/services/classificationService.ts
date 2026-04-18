import { pool } from "../config/db.js";
import type { ClassifiedTransaction } from "./aiClassifier.js";

type UpdateTransactionsInput = {
  userId: string;
  documentId: string;
  transactions: ClassifiedTransaction[];
};

export const updateClassifiedTransactions = async ({
  userId,
  documentId,
  transactions,
}: UpdateTransactionsInput): Promise<void> => {
  for (const tx of transactions) {
    await pool.query(
      `UPDATE transactions
       SET category = $1,
           confidence = $2
       WHERE user_id = $3
         AND document_id = $4
         AND description = $5
         AND amount = $6
         AND direction = $7`,
      [
        tx.category,
        tx.confidence,
        userId,
        documentId,
        tx.description,
        tx.amount,
        tx.direction,
      ]
    );
  }

  await pool.query(
    `UPDATE documents
     SET upload_status = 'classified'
     WHERE id = $1`,
    [documentId]
  );
};