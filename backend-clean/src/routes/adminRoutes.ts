import { Router } from "express";
import {
  deleteAdminUserAccount,
  getAdminAiMonitoring,
  getAdminFilings,
  getAdminOverview,
  getAdminUsers,
} from "../controllers/adminController.js";
import { authenticate, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/overview", getAdminOverview);
router.get("/users", getAdminUsers);
router.delete("/users/:userId", deleteAdminUserAccount);
router.get("/filings", getAdminFilings);
router.get("/ai-monitoring", getAdminAiMonitoring);

export default router;
