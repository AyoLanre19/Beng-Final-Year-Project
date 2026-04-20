import { Router } from "express";
import {
  calculateTaxPreview,
  downloadTaxFiling,
  getTaxSummary,
  submitTaxFiling,
} from "../controllers/taxController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, getTaxSummary);
router.post("/calculate", authenticate, calculateTaxPreview);
router.post("/submit-filing", authenticate, submitTaxFiling);
router.get("/download-filing/:filingId", authenticate, downloadTaxFiling);

export default router;
