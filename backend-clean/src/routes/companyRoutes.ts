import { Router } from "express";
import { submitCompanyVerification } from "../controllers/companyController.js";

const router = Router();

router.post("/verify", submitCompanyVerification);

export default router;