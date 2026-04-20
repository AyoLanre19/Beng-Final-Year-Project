import { Router } from "express";
import authRoutes from "./authRoutes.js";
import companyRoutes from "./companyRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import advisoryRoutes from "./advisoryRoutes.js";
import taxRoutes from "./taxRoutes.js";
import dashboardRoutes from "./dashboardRoutes.js";
import adminRoutes from "./adminRoutes.js";

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
router.use("/advisory", advisoryRoutes);
router.use("/tax", taxRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/admin", adminRoutes);

export default router;
