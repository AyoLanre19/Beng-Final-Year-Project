import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = "supersecret123"; // TEMP HARD-CODE

export interface AppJwtPayload extends JwtPayload {
  id: string;
  email: string;
  user_type: string;
  role: string;
}

export const generateToken = (payload: AppJwtPayload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string): AppJwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (
    typeof decoded === "string" ||
    !decoded ||
    typeof decoded.id !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.user_type !== "string" ||
    typeof decoded.role !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return decoded as AppJwtPayload;
};