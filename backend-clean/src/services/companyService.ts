import { randomUUID } from "crypto";
import { pool } from "../config/db.js";
import { hashPassword } from "../utils/hash.js";

type CompanyVerificationInput = {
  companyName: string;
  email: string;
  cacNumber: string;
  phone: string;
  password: string;
};

export const verifyCompany = async ({
  companyName,
  email,
  cacNumber,
  phone,
  password,
}: CompanyVerificationInput) => {
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
    `INSERT INTO users (
      id,
      company_name,
      email,
      cac_number,
      phone,
      password_hash,
      user_type,
      role,
      is_verified
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, company_name, email, cac_number, phone, user_type, role, is_verified, created_at`,
    [id, companyName, email, cacNumber, phone, hashedPassword, "company", "user", false]
  );

  return result.rows[0];
};