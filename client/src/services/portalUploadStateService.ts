import type { UploadFinancialDataResult } from "./filingService";

const buildKey = (userId: string, userType: string, suffix: string) =>
  `tax-system:${userId}:${userType}:uploads:${suffix}`;

export const getStoredActiveDocumentId = (
  userId: string,
  userType: string
): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(buildKey(userId, userType, "active-document"));
};

export const storeActiveDocumentId = (
  userId: string,
  userType: string,
  documentId: string
): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(buildKey(userId, userType, "active-document"), documentId);
};

export const getStoredUploadSnapshot = (
  userId: string,
  userType: string
): UploadFinancialDataResult | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(buildKey(userId, userType, "snapshot"));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UploadFinancialDataResult;
  } catch {
    return null;
  }
};

export const storeUploadSnapshot = (
  userId: string,
  userType: string,
  snapshot: UploadFinancialDataResult
): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    buildKey(userId, userType, "snapshot"),
    JSON.stringify(snapshot)
  );
};
