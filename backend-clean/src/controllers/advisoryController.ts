import { Response } from "express";
import { pool } from "../config/db.js";
import { generateAdvisories } from "../services/advisoryService.js";
import type { PortalType } from "../services/portalRules.js";
import { type AuthenticatedRequest } from "../middleware/auth.js";

type TransactionRow = {
  description: string;
  amount: string | number;
  direction: "inflow" | "outflow";
  category: string | null;
  confidence: string | number | null;
};

const resolveRequestContext = (req: AuthenticatedRequest) => {
  const userId = req.user?.id;
  const tokenUserType = req.user?.user_type;
  const requestedUserType = req.query.userType;

  if (!userId || !tokenUserType) {
    throw new Error("Unauthorized");
  }

  let userType: PortalType =
    tokenUserType === "individual" ||
    tokenUserType === "sme" ||
    tokenUserType === "company"
      ? tokenUserType
      : "individual";

  if (
    requestedUserType === "individual" ||
    requestedUserType === "sme" ||
    requestedUserType === "company"
  ) {
    userType = requestedUserType;
  }

  return { userId, userType };
};

export const getAdvisories = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { userId, userType } = resolveRequestContext(req);

    const result = await pool.query(
      `SELECT description, amount, direction, category, confidence
       FROM transactions
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    const transactions = result.rows.map((row: TransactionRow) => ({
      description: row.description,
      amount: Number(row.amount),
      direction: row.direction,
      category: row.category,
      confidence:
        row.confidence !== null ? Number(row.confidence) : null,
    }));

    const advisories = generateAdvisories(userType, transactions);

    return res.status(200).json({
      message: "Advisories generated successfully",
      userType,
      transactionCount: transactions.length,
      advisories,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate advisories";

    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({
      message,
    });
  }
};
