import { Request, Response } from "express";
import { loginUser, signupUser } from "../services/authService.js";
import { generateToken } from "../utils/jwt.js";
import { AuthenticatedRequest } from "../middleware/auth.js";

export const signup = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, userType } = req.body;

    if (!fullName || !email || !password || !userType) {
      return res.status(400).json({
        message: "fullName, email, password, and userType are required",
      });
    }

    if (userType !== "individual" && userType !== "sme") {
      return res.status(400).json({
        message: "userType must be either 'individual' or 'sme'",
      });
    }

    const user = await signupUser({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      userType,
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Signup failed";

    if (message === "User with this email already exists") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "email and password are required",
      });
    }

    const user = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Login failed";

    if (message === "Invalid email or password") {
      return res.status(401).json({ message });
    }

    return res.status(500).json({
      message,
    });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  return res.status(200).json({
    message: "Current user fetched successfully",
    user: req.user,
  });
};