import { Router } from "express";
import {
  changeCurrentUserPassword,
  getCurrentUser,
  login,
  signup,
  updateCurrentUser,
} from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getCurrentUser);
router.put("/me", authenticate, updateCurrentUser);
router.put("/change-password", authenticate, changeCurrentUserPassword);

export default router;
