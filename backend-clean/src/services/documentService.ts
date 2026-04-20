import { randomUUID } from "crypto";
import { pool } from "../config/db.js";

type CreateDocumentInput = {
  userId: string;
  originalName: string;
  fileType: string;
  sourceFormat?: string;
  sourceBank?: string;
  storagePath: string;
};

export const createDocument = async ({
  userId,
  originalName,
  fileType,
  sourceFormat,
  sourceBank,
  storagePath,
}: CreateDocumentInput) => {
  const id = randomUUID();

  const result = await pool.query(
    `INSERT INTO documents (
      id,
      user_id,
      original_name,
      file_type,
      source_format,
      source_bank,
      storage_path,
      upload_status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      id,
      userId,
      originalName,
      fileType,
      sourceFormat ?? null,
      sourceBank ?? null,
      storagePath,
      "uploaded",
    ]
  );

  return result.rows[0];
};

export const updateDocumentStatus = async (
  documentId: string,
  uploadStatus: string
): Promise<void> => {
  await pool.query(
    `UPDATE documents
     SET upload_status = $1
     WHERE id = $2`,
    [uploadStatus, documentId]
  );
};
