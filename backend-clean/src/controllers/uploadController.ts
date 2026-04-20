import { Response } from "express";
import { pool } from "../config/db.js";
import {
  createDocument,
  updateDocumentStatus,
} from "../services/documentService.js";
import { parseFile } from "../services/fileParser.js";
import { saveRawTransactions } from "../services/rawTransactionService.js";
import {
  normalizeRawTransaction,
  type NormalizedTransaction,
} from "../services/transactionNormalizer.js";
import { saveTransactions } from "../services/transactionService.js";
import {
  classifyTransactions,
  classifyTransactionsHeuristically,
  OLLAMA_MODEL,
} from "../services/aiClassifier.js";
import { updateClassifiedTransactions } from "../services/classificationService.js";
import { detectFileType } from "../services/fileTypeDetector.js";
import { type AuthenticatedRequest } from "../middleware/auth.js";

type UploadDocumentRow = {
  id: string;
  upload_status: string;
  original_name: string;
  file_type: string;
  created_at: string;
};

type UploadTransactionRow = {
  transaction_date: string | null;
  description: string;
  amount: string | number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: string | number | null;
};

type UploadCountRow = {
  total: string | number;
};

type UploadHistoryRow = {
  id: string;
  original_name: string;
  file_type: string;
  source_bank: string | null;
  upload_status: string;
  created_at: string;
  transactions_created: string | number;
  transactions_classified: string | number;
};

const getAuthenticatedPortalUser = (req: AuthenticatedRequest) => {
  const userId = req.user?.id;
  const userType = req.user?.user_type;

  if (!userId || !userType) {
    throw new Error("Unauthorized");
  }

  if (userType !== "individual" && userType !== "sme" && userType !== "company") {
    throw new Error("Unsupported user type");
  }

  return {
    userId,
    userType,
  } as const;
};

const mapTransactionPreview = (row: UploadTransactionRow) => ({
  transaction_date: row.transaction_date,
  description: row.description,
  amount: Number(row.amount),
  direction: row.direction,
  category: row.category,
  confidence:
    row.confidence !== null ? Number(row.confidence) : null,
});

const loadUploadStatusPayload = async (userId: string, documentId: string) => {
  const documentResult = await pool.query<UploadDocumentRow>(
    `SELECT id, upload_status, original_name, file_type, created_at
     FROM documents
     WHERE id = $1 AND user_id = $2`,
    [documentId, userId]
  );

  if (documentResult.rows.length === 0) {
    throw new Error("Upload record not found");
  }

  const transactionResult = await pool.query<UploadTransactionRow>(
    `SELECT transaction_date, description, amount, direction, category, confidence
     FROM transactions
     WHERE user_id = $1 AND document_id = $2
     ORDER BY created_at ASC
     LIMIT 20`,
    [userId, documentId]
  );

  const totalTransactionsResult = await pool.query<UploadCountRow>(
    `SELECT COUNT(*) AS total
     FROM transactions
     WHERE user_id = $1 AND document_id = $2`,
    [userId, documentId]
  );

  const classifiedTransactionsResult = await pool.query<UploadCountRow>(
    `SELECT COUNT(*) AS total
     FROM transactions
     WHERE user_id = $1 AND document_id = $2 AND category IS NOT NULL`,
    [userId, documentId]
  );

  const document = documentResult.rows[0];
  const uploadStatus = document.upload_status;
  const aiStatus =
    uploadStatus === "classified"
      ? "classified"
      : uploadStatus === "failed"
        ? "failed"
        : "processing";

  return {
    message:
      aiStatus === "classified"
        ? "AI classification completed successfully."
        : aiStatus === "failed"
          ? "AI classification could not complete. Your parsed transactions and preview categories are still available for review."
          : "Your statement was parsed. Preview categories are ready while Ollama finishes the full classification in the background.",
    rowsParsed: Number(totalTransactionsResult.rows[0]?.total ?? 0),
    transactionsCreated: Number(totalTransactionsResult.rows[0]?.total ?? 0),
    transactionsClassified: Number(classifiedTransactionsResult.rows[0]?.total ?? 0),
    warnings:
      aiStatus === "failed"
        ? [
            "Ollama could not finish classification for this upload. The parsed data is still saved and can be reviewed while AI catches up.",
          ]
        : [],
      ai: {
        model: OLLAMA_MODEL,
        status: aiStatus,
    } as const,
    previewTransactions: transactionResult.rows.map(mapTransactionPreview),
    document: {
      id: document.id,
      original_name: document.original_name,
      file_type: document.file_type,
      created_at: document.created_at,
    },
  };
};

const runBackgroundClassification = async ({
  userId,
  userType,
  documentId,
  normalizedTransactions,
}: {
  userId: string;
  userType: "individual" | "sme" | "company";
  documentId: string;
  normalizedTransactions: NormalizedTransaction[];
}) => {
  try {
    const classifiedTransactions = await classifyTransactions(
      userType,
      normalizedTransactions
    );

    await updateClassifiedTransactions({
      userId,
      documentId,
      transactions: classifiedTransactions,
    });
  } catch {
    await updateDocumentStatus(documentId, "failed");
  }
};

export const uploadBankStatement = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const { userId, userType } = getAuthenticatedPortalUser(req);
    const { fileType, sourceFormat } = detectFileType(
      req.file.mimetype,
      req.file.originalname
    );

    if (fileType === "unknown") {
      return res.status(400).json({
        message: "Unsupported file type. Upload PDF, CSV, Excel, or image.",
      });
    }

    const parsedFile = await parseFile({
      filePath: req.file.path,
      fileType,
      originalName: req.file.originalname,
    });

    const normalizedTransactions: NormalizedTransaction[] = parsedFile.rows
      .map((row) => normalizeRawTransaction(row))
      .filter((row): row is NormalizedTransaction => row !== null);

    if (normalizedTransactions.length === 0) {
      return res.status(422).json({
        message:
          "The file uploaded successfully, but no valid transaction rows could be normalized from it.",
        warnings: parsedFile.warnings,
      });
    }

    const previewClassifications = classifyTransactionsHeuristically(
      userType,
      normalizedTransactions
    );

    const document = await createDocument({
      userId,
      originalName: req.file.originalname,
      fileType,
      sourceFormat,
      sourceBank: parsedFile.sourceBank ?? undefined,
      storagePath: req.file.path,
    });

    await saveRawTransactions({
      documentId: document.id,
      rows: parsedFile.rows,
    });

    await saveTransactions({
      userId,
      documentId: document.id,
      sourceType: fileType,
      sourceBank: document.source_bank,
      transactions: previewClassifications,
    });

    await updateDocumentStatus(document.id, "parsed");

    void runBackgroundClassification({
      userId,
      userType,
      documentId: document.id,
      normalizedTransactions,
    });

    return res.status(202).json({
      message:
        "File uploaded and parsed successfully. Preview categories are ready now, and Ollama is refining them in the background.",
      rowsParsed: parsedFile.rows.length,
      transactionsCreated: normalizedTransactions.length,
      transactionsClassified: previewClassifications.filter(
        (transaction) => transaction.category !== null
      ).length,
      sourceBank: parsedFile.sourceBank,
      warnings: parsedFile.warnings,
      ai: {
        model: OLLAMA_MODEL,
        status: "processing",
      },
      previewTransactions: previewClassifications.slice(0, 12),
      document,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Unsupported user type"
          ? 400
          : 500;

    return res.status(status).json({
      message,
    });
  }
};

export const getUploadStatus = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = getAuthenticatedPortalUser(req);
    const documentId =
      typeof req.params.documentId === "string" ? req.params.documentId.trim() : "";

    if (!documentId) {
      return res.status(400).json({
        message: "documentId is required",
      });
    }

    const payload = await loadUploadStatusPayload(userId, documentId);

    return res.status(200).json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to fetch upload status";

    const status =
      message === "Unauthorized"
        ? 401
        : message === "Upload record not found"
          ? 404
          : 500;

    return res.status(status).json({
      message,
    });
  }
};

export const getUploadHistory = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId } = getAuthenticatedPortalUser(req);
    const limit = Math.min(
      20,
      Math.max(1, Number(typeof req.query.limit === "string" ? req.query.limit : 10) || 10)
    );

    const result = await pool.query<UploadHistoryRow>(
      `SELECT
         documents.id,
         documents.original_name,
         documents.file_type,
         documents.source_bank,
         documents.upload_status,
         documents.created_at,
         COUNT(transactions.id)::int AS transactions_created,
         COUNT(transactions.id) FILTER (WHERE transactions.category IS NOT NULL)::int AS transactions_classified
       FROM documents
       LEFT JOIN transactions
         ON transactions.document_id = documents.id
       WHERE documents.user_id = $1
       GROUP BY documents.id
       ORDER BY documents.created_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return res.status(200).json({
      message: "Upload history loaded successfully",
      history: result.rows.map((row) => ({
        id: row.id,
        original_name: row.original_name,
        file_type: row.file_type,
        source_bank: row.source_bank,
        upload_status: row.upload_status,
        created_at: row.created_at,
        transactionsCreated: Number(row.transactions_created),
        transactionsClassified: Number(row.transactions_classified),
      })),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load upload history";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      message,
    });
  }
};
