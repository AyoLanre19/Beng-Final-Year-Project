import { Request, Response } from "express";
import {
  getCurrentUserProfile,
  loginUser,
  signupUser,
  updateUserPassword,
  updateUserProfile,
} from "../services/authService.js";
import { AuthenticatedRequest } from "../middleware/auth.js";
import { generateToken } from "../utils/jwt.js";

const getAuthUserId = (req: AuthenticatedRequest) => {
  if (!req.user?.id) {
    throw new Error("Unauthorized");
  }

  return req.user.id;
};

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
    const message = error instanceof Error ? error.message : "Signup failed";

    if (message === "User with this email already exists") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({ message });
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
    const message = error instanceof Error ? error.message : "Login failed";

    if (message === "Invalid email or password") {
      return res.status(401).json({ message });
    }

    return res.status(500).json({ message });
  }
};

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = getAuthUserId(req);
    const user = await getCurrentUserProfile(userId);

    return res.status(200).json({
      message: "Current user fetched successfully",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch user";
    const status = message === "Unauthorized" ? 401 : 500;

    return res.status(status).json({ message });
  }
};

export const updateCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = getAuthUserId(req);
    const { displayName, email, phone } = req.body;

    if (!displayName || !email) {
      return res.status(400).json({
        message: "displayName and email are required",
      });
    }

    const user = await updateUserProfile({
      userId,
      displayName,
      email,
      phone,
    });

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update profile";

    if (message === "Unauthorized") {
      return res.status(401).json({ message });
    }

    if (message === "User with this email already exists") {
      return res.status(409).json({ message });
    }

    return res.status(500).json({ message });
  }
};

export const changeCurrentUserPassword = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = getAuthUserId(req);
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "currentPassword and newPassword are required",
      });
    }

    if (typeof newPassword !== "string" || newPassword.trim().length < 8) {
      return res.status(400).json({
        message: "newPassword must be at least 8 characters long",
      });
    }

    await updateUserPassword({
      userId,
      currentPassword,
      newPassword,
    });

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update password";

    if (message === "Unauthorized") {
      return res.status(401).json({ message });
    }

    if (message === "Current password is incorrect") {
      return res.status(400).json({ message });
    }

    return res.status(500).json({ message });
  }
};
