import { useEffect, useState } from "react";
import { getStoredUser } from "../services/authService";
import {
  fetchUploadHistory,
  fetchUploadProcessingStatus,
  type UploadFinancialDataResult,
  type UploadHistoryItem,
} from "../services/filingService";
import {
  getStoredActiveDocumentId,
  getStoredUploadSnapshot,
  storeActiveDocumentId,
  storeUploadSnapshot,
} from "../services/portalUploadStateService";

export const usePortalUploadData = (
  userType: "individual" | "sme" | "company"
) => {
  const user = getStoredUser();
  const userId = user?.id ?? null;

  const [history, setHistory] = useState<UploadHistoryItem[]>([]);
  const [activeUpload, setActiveUpload] = useState<UploadFinancialDataResult | null>(
    () =>
      (userId && getStoredUploadSnapshot(userId, userType)) ||
      null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUploadByDocumentId = async (
    documentId: string,
    options?: { silent?: boolean }
  ) => {
    if (!userId) {
      return null;
    }

    if (!options?.silent) {
      setLoading(true);
    }

    try {
      const nextUpload = await fetchUploadProcessingStatus(documentId);
      setActiveUpload(nextUpload);
      storeActiveDocumentId(userId, userType, documentId);
      storeUploadSnapshot(userId, userType, nextUpload);
      setError("");
      return nextUpload;
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load the selected upload."
      );
      return null;
    } finally {
      if (!options?.silent) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setHistory([]);
      setActiveUpload(null);
      return;
    }

    let active = true;

    const hydrate = async () => {
      setLoading(true);

      try {
        const nextHistory = await fetchUploadHistory(12);

        if (!active) {
          return;
        }

        setHistory(nextHistory);

        const preferredDocumentId =
          getStoredActiveDocumentId(userId, userType) ||
          nextHistory[0]?.id ||
          null;

        if (preferredDocumentId) {
          await loadUploadByDocumentId(preferredDocumentId, { silent: true });
        } else {
          setActiveUpload(null);
        }
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load previous uploads."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void hydrate();

    return () => {
      active = false;
    };
  }, [userId, userType]);

  const handleUploaded = (result: UploadFinancialDataResult) => {
    if (!userId) {
      setActiveUpload(result);
      return;
    }

    setActiveUpload(result);
    storeUploadSnapshot(userId, userType, result);

    if (result.document?.id) {
      storeActiveDocumentId(userId, userType, result.document.id);

      setHistory((currentHistory) => {
        const remaining = currentHistory.filter(
          (item) => item.id !== result.document?.id
        );

        return [
          {
            id: result.document.id,
            original_name: result.document.original_name || "Uploaded statement",
            file_type: result.document.file_type || "unknown",
            source_bank: result.sourceBank,
            upload_status: result.ai.status,
            created_at: result.document.created_at || new Date().toISOString(),
            transactionsCreated: result.transactionsCreated,
            transactionsClassified: result.transactionsClassified || 0,
          },
          ...remaining,
        ].slice(0, 12);
      });
    }
  };

  return {
    history,
    activeUpload,
    loading,
    error,
    selectDocument: loadUploadByDocumentId,
    handleUploaded,
  };
};
