import { Response } from "express";
import { pool } from "../config/db.js";
import { type AuthenticatedRequest } from "../middleware/auth.js";

type CountRow = {
  total: string | number;
};

type TaxTotalRow = {
  total_tax: string | number | null;
};

type ChartRow = {
  month: string;
  total: string | number;
};

type RecentActivityRow = {
  user_id: string;
  name: string;
  email: string;
  user_type: string;
  filing_status: string | null;
  risk_score: string | number;
};

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  user_type: string;
  documents_uploaded: string | number;
  filings_submitted: string | number;
  low_confidence_count: string | number;
  uncategorized_count: string | number;
  last_active: string | null;
};

type FilingRow = {
  filing_id: string;
  reference_number: string;
  tax_period: string;
  total_income: string | number;
  total_expenses: string | number;
  total_tax: string | number;
  filing_status: string;
  submitted_at: string | null;
  user_id: string;
  user_name: string;
  email: string;
  user_type: string;
};

type DocumentRow = {
  id: string;
  original_name: string;
  file_type: string;
  source_bank: string | null;
  upload_status: string;
  created_at: string;
  user_id: string;
};

type AiMetricRow = {
  avg_confidence: string | number | null;
  processed_total: string | number;
  low_confidence_total: string | number;
  uncategorized_total: string | number;
};

type LowConfidenceRow = {
  transaction_date: string | null;
  user_name: string;
  user_id: string;
  description: string;
  category: string | null;
  confidence: string | number | null;
};

const round2 = (value: number): number => Math.round(value * 100) / 100;

const requireAdminUser = (req: AuthenticatedRequest) => {
  if (!req.user?.id || req.user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return req.user.id;
};

const toRiskLabel = (score: number): "Low" | "Medium" | "High" => {
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
};

const toStatusLabel = (row: AdminUserRow): "Active" | "Inactive" | "Flagged" => {
  const lowConfidence = Number(row.low_confidence_count);
  const uncategorized = Number(row.uncategorized_count);

  if (lowConfidence + uncategorized >= 6) {
    return "Flagged";
  }

  return row.last_active ? "Active" : "Inactive";
};

const shortenDescription = (value: string): string => {
  const cleaned = value
    .replace(/\b\d{6,}\b/g, " ")
    .replace(/[_-]{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ").filter(Boolean);
  return words.slice(0, 6).join(" ");
};

export const getAdminOverview = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    requireAdminUser(req);

    const [
      usersResult,
      filingsResult,
      taxTotalResult,
      accuracyResult,
      filingsTrendResult,
      userGrowthResult,
      recentActivityResult,
    ] = await Promise.all([
      pool.query<CountRow>(`SELECT COUNT(*) AS total FROM users WHERE role <> 'admin'`),
      pool.query<CountRow>(`SELECT COUNT(*) AS total FROM tax_returns WHERE filing_status IN ('submitted', 'approved', 'audit')`),
      pool.query<TaxTotalRow>(`SELECT COALESCE(SUM(total_tax), 0) AS total_tax FROM tax_returns`),
      pool.query<AiMetricRow>(
        `SELECT
           COALESCE(AVG(confidence), 0) AS avg_confidence,
           COUNT(*) AS processed_total,
           COUNT(*) FILTER (WHERE confidence IS NOT NULL AND confidence < 0.6) AS low_confidence_total,
           COUNT(*) FILTER (WHERE category IS NULL) AS uncategorized_total
         FROM transactions`
      ),
      pool.query<ChartRow>(
        `SELECT TO_CHAR(DATE_TRUNC('month', submitted_at), 'Mon') AS month, COUNT(*) AS total
         FROM tax_returns
         WHERE submitted_at IS NOT NULL
         GROUP BY DATE_TRUNC('month', submitted_at)
         ORDER BY DATE_TRUNC('month', submitted_at) ASC
         LIMIT 12`
      ),
      pool.query<ChartRow>(
        `SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month, COUNT(*) AS total
         FROM users
         WHERE role <> 'admin'
         GROUP BY DATE_TRUNC('month', created_at)
         ORDER BY DATE_TRUNC('month', created_at) ASC
         LIMIT 12`
      ),
      pool.query<RecentActivityRow>(
        `SELECT
           users.id AS user_id,
           COALESCE(NULLIF(users.company_name, ''), NULLIF(users.full_name, ''), users.email) AS name,
           users.email,
           users.user_type,
           COALESCE(
             (
               SELECT filing_status
               FROM tax_returns
               WHERE tax_returns.user_id = users.id
               ORDER BY submitted_at DESC NULLS LAST
               LIMIT 1
             ),
             'draft'
           ) AS filing_status,
           (
             COALESCE((
               SELECT COUNT(*)
               FROM transactions
               WHERE transactions.user_id = users.id AND confidence IS NOT NULL AND confidence < 0.6
             ), 0) * 8 +
             COALESCE((
               SELECT COUNT(*)
               FROM transactions
               WHERE transactions.user_id = users.id AND category IS NULL
             ), 0) * 12
           ) AS risk_score
         FROM users
         WHERE users.role <> 'admin'
         ORDER BY users.created_at DESC
         LIMIT 8`
      ),
    ]);

    const avgConfidence = Number(accuracyResult.rows[0]?.avg_confidence ?? 0);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers: Number(usersResult.rows[0]?.total ?? 0),
          filingsSubmitted: Number(filingsResult.rows[0]?.total ?? 0),
          totalTaxEstimated: Number(taxTotalResult.rows[0]?.total_tax ?? 0),
          aiAccuracy: round2(avgConfidence * 100),
        },
        filingsTrend: filingsTrendResult.rows.map((row) => ({
          month: row.month,
          filings: Number(row.total),
        })),
        userGrowth: userGrowthResult.rows.map((row) => ({
          month: row.month,
          users: Number(row.total),
        })),
        recentActivity: recentActivityResult.rows.map((row) => ({
          userId: row.user_id,
          name: row.name,
          email: row.email,
          type: row.user_type,
          filingStatus: row.filing_status || "draft",
          risk: toRiskLabel(Number(row.risk_score)),
        })),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load admin overview";
    const status = message === "Forbidden" ? 403 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const getAdminUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
    try {
      requireAdminUser(req);

      const result = await pool.query<AdminUserRow>(
        `SELECT
           users.id,
           COALESCE(NULLIF(users.company_name, ''), NULLIF(users.full_name, ''), users.email) AS name,
           users.email,
           users.user_type,
           COUNT(DISTINCT documents.id) AS documents_uploaded,
           COUNT(DISTINCT tax_returns.id) AS filings_submitted,
           COUNT(transactions.id) FILTER (WHERE transactions.confidence IS NOT NULL AND transactions.confidence < 0.6) AS low_confidence_count,
           COUNT(transactions.id) FILTER (WHERE transactions.category IS NULL) AS uncategorized_count,
           MAX(COALESCE(tax_returns.submitted_at, documents.created_at, users.created_at)) AS last_active
         FROM users
         LEFT JOIN documents
           ON documents.user_id = users.id
         LEFT JOIN tax_returns
           ON tax_returns.user_id = users.id
         LEFT JOIN transactions
           ON transactions.user_id = users.id
         WHERE users.role <> 'admin'
         GROUP BY users.id
         ORDER BY users.created_at DESC`
      );

      return res.status(200).json({
        success: true,
        data: result.rows.map((row) => {
          const riskScore = Math.min(
            99,
            Number(row.low_confidence_count) * 8 +
              Number(row.uncategorized_count) * 12
          );

          return {
            id: row.id,
            name: row.name,
            email: row.email,
            type: row.user_type,
            status: toStatusLabel(row),
            filingStatus:
              Number(row.filings_submitted) > 0 ? "Submitted" : Number(row.documents_uploaded) > 0 ? "Draft" : "Not Started",
            riskScore: toRiskLabel(riskScore),
            riskPercent: riskScore,
            lastActive: row.last_active,
            uploads: Number(row.documents_uploaded),
            filings: Number(row.filings_submitted),
          };
        }),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to load admin users";
      const status = message === "Forbidden" ? 403 : 500;

      return res.status(status).json({
        success: false,
        message,
      });
    }
};

export const deleteAdminUserAccount = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const adminUserId = requireAdminUser(req);
    const userId =
      typeof req.params.userId === "string" ? req.params.userId.trim() : "";

    if (!userId) {
      return res.status(400).json({
        message: "userId is required",
      });
    }

    if (userId === adminUserId) {
      return res.status(400).json({
        message: "Admin accounts cannot delete themselves from this screen.",
      });
    }

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1 AND role <> 'admin'
       RETURNING id`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User account not found",
      });
    }

    return res.status(200).json({
      message: "User account deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to delete user account";
    const status = message === "Forbidden" ? 403 : 500;

    return res.status(status).json({
      message,
    });
  }
};

export const getAdminFilings = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    requireAdminUser(req);

    const [filingsResult, documentsResult] = await Promise.all([
      pool.query<FilingRow>(
        `SELECT
           tax_returns.id AS filing_id,
           tax_returns.reference_number,
           tax_returns.tax_period,
           tax_returns.total_income,
           tax_returns.total_expenses,
           tax_returns.total_tax,
           tax_returns.filing_status,
           tax_returns.submitted_at,
           users.id AS user_id,
           COALESCE(NULLIF(users.company_name, ''), NULLIF(users.full_name, ''), users.email) AS user_name,
           users.email,
           users.user_type
         FROM tax_returns
         INNER JOIN users
           ON users.id = tax_returns.user_id
         ORDER BY tax_returns.submitted_at DESC NULLS LAST, tax_returns.id DESC
         LIMIT 25`
      ),
      pool.query<DocumentRow>(
        `SELECT
           documents.id,
           documents.original_name,
           documents.file_type,
           documents.source_bank,
           documents.upload_status,
           documents.created_at,
           users.id AS user_id
         FROM documents
         INNER JOIN users
           ON users.id = documents.user_id
         ORDER BY documents.created_at DESC
         LIMIT 50`
      ),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        filings: filingsResult.rows.map((row) => ({
          filingId: row.filing_id,
          referenceNumber: row.reference_number,
          taxPeriod: row.tax_period,
          totalIncome: Number(row.total_income),
          totalExpenses: Number(row.total_expenses),
          totalTax: Number(row.total_tax),
          filingStatus: row.filing_status,
          submittedAt: row.submitted_at,
          user: {
            id: row.user_id,
            name: row.user_name,
            email: row.email,
            type: row.user_type,
          },
        })),
        documents: documentsResult.rows.map((row) => ({
          id: row.id,
          userId: row.user_id,
          originalName: row.original_name,
          fileType: row.file_type,
          sourceBank: row.source_bank,
          uploadStatus: row.upload_status,
          createdAt: row.created_at,
        })),
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load admin filings";
    const status = message === "Forbidden" ? 403 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};

export const getAdminAiMonitoring = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    requireAdminUser(req);

    const [metricsResult, accuracyTrendResult, lowConfidenceResult] = await Promise.all([
      pool.query<AiMetricRow>(
        `SELECT
           COALESCE(AVG(confidence), 0) AS avg_confidence,
           COUNT(*) AS processed_total,
           COUNT(*) FILTER (WHERE confidence IS NOT NULL AND confidence < 0.6) AS low_confidence_total,
           COUNT(*) FILTER (WHERE category IS NULL) AS uncategorized_total
         FROM transactions`
      ),
      pool.query<ChartRow>(
        `SELECT
           TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') AS month,
           ROUND(COALESCE(AVG(confidence), 0) * 100) AS total
         FROM transactions
         WHERE confidence IS NOT NULL
         GROUP BY DATE_TRUNC('month', created_at)
         ORDER BY DATE_TRUNC('month', created_at) ASC
         LIMIT 12`
      ),
      pool.query<LowConfidenceRow>(
        `SELECT
           transactions.transaction_date,
           COALESCE(NULLIF(users.company_name, ''), NULLIF(users.full_name, ''), users.email) AS user_name,
           users.id AS user_id,
           transactions.description,
           transactions.category,
           transactions.confidence
         FROM transactions
         INNER JOIN users
           ON users.id = transactions.user_id
         WHERE transactions.category IS NULL
            OR transactions.confidence IS NULL
            OR transactions.confidence < 0.6
         ORDER BY transactions.created_at DESC
         LIMIT 20`
      ),
    ]);

    const metrics = metricsResult.rows[0];
    const avgConfidencePercent = round2(Number(metrics?.avg_confidence ?? 0) * 100);
    const lowConfidenceTotal = Number(metrics?.low_confidence_total ?? 0);
    const uncategorizedTotal = Number(metrics?.uncategorized_total ?? 0);
    const alerts: string[] = [];

    if (avgConfidencePercent < 70) {
      alerts.push("Average AI confidence is low. Review slow-model or prompt settings.");
    }

    if (lowConfidenceTotal > 10) {
      alerts.push("Many transactions are arriving with low confidence and need review.");
    }

    if (uncategorizedTotal > 0) {
      alerts.push("Some parsed transactions are still missing categories.");
    }

    if (alerts.length === 0) {
      alerts.push("AI monitoring is stable. Background classification is completing normally.");
    }

    return res.status(200).json({
      success: true,
      data: {
        overallAccuracy: avgConfidencePercent,
        totalTransactionsProcessed: Number(metrics?.processed_total ?? 0),
        averageConfidence: avgConfidencePercent,
        lowConfidenceCount: lowConfidenceTotal,
        uncategorizedCount: uncategorizedTotal,
        accuracyTrend: accuracyTrendResult.rows.map((row) => ({
          month: row.month,
          accuracy: Number(row.total),
        })),
        errorTypes: [
          { label: "Low confidence", value: lowConfidenceTotal },
          { label: "Uncategorized", value: uncategorizedTotal },
        ],
        recentIssues: lowConfidenceResult.rows.map((row) => ({
          date: row.transaction_date,
          user: row.user_name,
          userId: row.user_id,
          description: shortenDescription(row.description),
          aiCategory: row.category || "Needs review",
          confidence: row.confidence !== null ? round2(Number(row.confidence) * 100) : null,
        })),
        alerts,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load AI monitoring";
    const status = message === "Forbidden" ? 403 : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
};
