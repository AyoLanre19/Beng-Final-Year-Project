import { Router } from "express";
import { getAdvisories } from "../controllers/advisoryController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getAdvisories);

export default router;
