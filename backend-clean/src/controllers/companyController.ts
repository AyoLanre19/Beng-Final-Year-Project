import { Request, Response } from "express";
import { verifyCompany } from "../services/companyService.js";

export const submitCompanyVerification = async (req: Request, res: Response) => {
  try {
    const { companyName, email, cacNumber, phone, password } = req.body;

    if (!companyName || !email || !cacNumber || !phone || !password) {
      return res.status(400).json({
        message: "companyName, email, cacNumber, phone, and password are required",
      });
    }

    const company = await verifyCompany({
      companyName: companyName.trim(),
      email: email.trim().toLowerCase(),
      cacNumber: cacNumber.trim(),
      phone: phone.trim(),
      password,
    });

    return res.status(201).json({
      message: "Company verification submitted successfully",
      company,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Company verification failed";

    if (message === "User with this email already exists") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({ message });
  }
};