import { Request, Response, NextFunction } from "express";
import { verifyToken, type AppJwtPayload } from "../utils/jwt.js";

export interface AuthenticatedRequest extends Request {
  user?: AppJwtPayload;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    console.log("EXTRACTED TOKEN:", token);

    if (!token) {
      return res.status(401).json({
        message: "Invalid token format",
      });
    }

    const decoded = verifyToken(token);

    console.log("DECODED TOKEN:", decoded);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};