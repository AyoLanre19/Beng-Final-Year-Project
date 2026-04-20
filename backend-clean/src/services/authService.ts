import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  userType: "individual" | "sme";
};

type LoginInput = {
  email: string;
  password: string;
};

export type ProfileUpdateInput = {
  userId: string;
  displayName: string;
  email: string;
  phone?: string;
};

export type PasswordUpdateInput = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

const SAFE_USER_FIELDS = `
  id,
  full_name,
  company_name,
  email,
  phone,
  user_type,
  role,
  is_verified,
  created_at
`;

const getUserRecordById = async (userId: string) => {
  const result = await pool.query(
    `SELECT ${SAFE_USER_FIELDS}, password_hash
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

export const getCurrentUserProfile = async (userId: string) => {
  const result = await pool.query(
    `SELECT ${SAFE_USER_FIELDS}
     FROM users
     WHERE id = $1`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found");
  }

  return result.rows[0];
};

export const signupUser = async ({
  fullName,
  email,
  password,
  userType,
}: SignupInput) => {
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);
  const id = randomUUID();

  const result = await pool.query(
    `INSERT INTO users (id, full_name, email, password_hash, user_type, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${SAFE_USER_FIELDS}`,
    [id, fullName, email, hashedPassword, userType, "user"]
  );

  return result.rows[0];
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const result = await pool.query(
    `SELECT ${SAFE_USER_FIELDS}, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];
  const passwordMatches = await comparePassword(password, user.password_hash);

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  return {
    id: user.id,
    full_name: user.full_name,
    company_name: user.company_name,
    email: user.email,
    phone: user.phone,
    user_type: user.user_type,
    role: user.role,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
};

export const updateUserProfile = async ({
  userId,
  displayName,
  email,
  phone,
}: ProfileUpdateInput) => {
  const existingUser = await getUserRecordById(userId);
  const trimmedEmail = email.trim().toLowerCase();

  if (trimmedEmail !== existingUser.email) {
    const duplicate = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id <> $2",
      [trimmedEmail, userId]
    );

    if (duplicate.rows.length > 0) {
      throw new Error("User with this email already exists");
    }
  }

  const displayColumn = existingUser.user_type === "company" ? "company_name" : "full_name";
  const trimmedDisplayName = displayName.trim();
  const trimmedPhone = typeof phone === "string" && phone.trim().length > 0 ? phone.trim() : null;

  const result = await pool.query(
    `UPDATE users
     SET ${displayColumn} = $1,
         email = $2,
         phone = $3
     WHERE id = $4
     RETURNING ${SAFE_USER_FIELDS}`,
    [trimmedDisplayName, trimmedEmail, trimmedPhone, userId]
  );

  return result.rows[0];
};

export const updateUserPassword = async ({
  userId,
  currentPassword,
  newPassword,
}: PasswordUpdateInput) => {
  const user = await getUserRecordById(userId);
  const passwordMatches = await comparePassword(currentPassword, user.password_hash);

  if (!passwordMatches) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await hashPassword(newPassword);

  await pool.query(
    `UPDATE users
     SET password_hash = $1
     WHERE id = $2`,
    [hashedPassword, userId]
  );
};
