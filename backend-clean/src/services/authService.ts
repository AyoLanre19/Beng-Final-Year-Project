import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/**
 * Type for signup input (individual / SME)
 */
type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  userType: "individual" | "sme";
};

/**
 * Type for login input (all users)
 */
type LoginInput = {
  email: string;
  password: string;
};

/**
 * SIGNUP FUNCTION
 * Creates a new individual or SME user
 */
export const signupUser = async ({
  fullName,
  email,
  password,
  userType,
}: SignupInput) => {
  // Check if user already exists
  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error("User with this email already exists");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Generate unique ID
  const id = randomUUID();

  // Insert user into database
  const result = await pool.query(
    `INSERT INTO users (id, full_name, email, password_hash, user_type, role)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, full_name, email, user_type, role, created_at`,
    [id, fullName, email, hashedPassword, userType, "user"]
  );

  return result.rows[0];
};

/**
 * LOGIN FUNCTION
 * Works for:
 * - individual
 * - sme
 * - company
 * - admin
 */
export const loginUser = async ({ email, password }: LoginInput) => {
  // Fetch user by email
  const result = await pool.query(
    `SELECT id, full_name, company_name, email, password_hash, user_type, role, is_verified, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  // If no user found
  if (result.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = result.rows[0];

  // Compare password
  const passwordMatches = await comparePassword(
    password,
    user.password_hash
  );

  if (!passwordMatches) {
    throw new Error("Invalid email or password");
  }

  // Return safe user data (no password)
  return {
    id: user.id,
    full_name: user.full_name,
    company_name: user.company_name,
    email: user.email,
    user_type: user.user_type,
    role: user.role,
    is_verified: user.is_verified,
    created_at: user.created_at,
  };
};