import { Router } from "express";
import authRoutes from "./authRoutes.js";
import companyRoutes from "./companyRoutes.js";
import uploadRoutes from "./uploadRoutes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    message: "Backend is running",
  });
});

router.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
  });
});

router.use("/auth", authRoutes);
router.use("/company", companyRoutes);
router.use("/upload", uploadRoutes);

export default router;