import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getUploadHistory,
  getUploadStatus,
  uploadBankStatement,
} from "../controllers/uploadController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const allowedExtensions = [
  ".pdf",
  ".csv",
  ".xlsx",
  ".xls",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
];

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    cb(new Error("Unsupported file type"));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

router.get("/history", authenticate, getUploadHistory);
router.get("/:documentId/status", authenticate, getUploadStatus);
router.post("/", authenticate, upload.single("statement"), uploadBankStatement);

export default router;
