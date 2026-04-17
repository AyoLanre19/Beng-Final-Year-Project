import { Response } from "express";
import path from "path";
import { createDocument } from "../services/documentService.js";
import type { AuthenticatedRequest } from "../middleware/auth.js";
import { parseFile } from "../services/fileParser.js";
import { saveRawTransactions } from "../services/rawTransactionService.js";
import {
  normalizeRawTransaction,
  type NormalizedTransaction,
} from "../services/transactionNormalizer.js";
import { saveTransactions } from "../services/transactionService.js";

const getFileType = (mimeType: string, originalName: string): string => {
  const ext = path.extname(originalName).toLowerCase();

  if (mimeType.includes("pdf") || ext === ".pdf") return "pdf";
  if (mimeType.includes("csv") || ext === ".csv") return "csv";
  if (mimeType.includes("sheet") || ext === ".xlsx" || ext === ".xls") {
    return "xlsx";
  }
  if (
    mimeType.includes("image") ||
    [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
  ) {
    return "image";
  }

  return "unknown";
};

const getSourceFormat = (fileType: string): string => {
  if (fileType === "pdf") return "statement_pdf";
  if (fileType === "csv") return "csv_export";
  if (fileType === "xlsx") return "excel_export";
  if (fileType === "image") return "screenshot";
  return "unknown";
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

    const fileType = getFileType(req.file.mimetype, req.file.originalname);

    if (fileType === "unknown") {
      return res.status(400).json({
        message: "Unsupported file type. Upload PDF, CSV, Excel, or image.",
      });
    }

    const userId = req.user?.id ?? "cd5d95c7-c9a8-4680-92e4-6344bfe768af";

    const document = await createDocument({
      userId,
      originalName: req.file.originalname,
      fileType,
      sourceFormat: getSourceFormat(fileType),
      storagePath: req.file.path,
    });

    if (fileType === "csv" || fileType === "xlsx") {
      const parsedRows = parseFile(req.file.path);

      await saveRawTransactions({
        documentId: document.id,
        rows: parsedRows,
      });

      const normalizedTransactions: NormalizedTransaction[] = parsedRows
        .map((row) => normalizeRawTransaction(row))
        .filter((row): row is NormalizedTransaction => row !== null);

      await saveTransactions({
        userId,
        documentId: document.id,
        sourceType: fileType,
        sourceBank: document.source_bank,
        transactions: normalizedTransactions,
      });

      return res.status(201).json({
        message: "File uploaded, parsed, and normalized successfully",
        rowsParsed: parsedRows.length,
        transactionsCreated: normalizedTransactions.length,
        document,
      });
    }

    return res.status(201).json({
      message: "Bank statement uploaded successfully",
      document,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed";

    return res.status(500).json({
      message,
    });
  }
};