import path from "path";

export type DetectedFileType = "pdf" | "csv" | "xlsx" | "image" | "unknown";

export type DetectedSourceFormat =
  | "statement_pdf"
  | "csv_export"
  | "excel_export"
  | "screenshot"
  | "unknown";

export type FileDetectionResult = {
  fileType: DetectedFileType;
  sourceFormat: DetectedSourceFormat;
};

export const detectFileType = (
  mimeType: string,
  originalName: string
): FileDetectionResult => {
  const ext = path.extname(originalName).toLowerCase();

  if (mimeType.includes("pdf") || ext === ".pdf") {
    return {
      fileType: "pdf",
      sourceFormat: "statement_pdf",
    };
  }

  if (mimeType.includes("csv") || ext === ".csv") {
    return {
      fileType: "csv",
      sourceFormat: "csv_export",
    };
  }

  if (
    mimeType.includes("sheet") ||
    ext === ".xlsx" ||
    ext === ".xls"
  ) {
    return {
      fileType: "xlsx",
      sourceFormat: "excel_export",
    };
  }

  if (
    mimeType.includes("image") ||
    [".png", ".jpg", ".jpeg", ".webp"].includes(ext)
  ) {
    return {
      fileType: "image",
      sourceFormat: "screenshot",
    };
  }

  return {
    fileType: "unknown",
    sourceFormat: "unknown",
  };
};