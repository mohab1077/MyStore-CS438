import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || ".jpg");
    cb(null, `${Date.now()}_${Math.random().toString(16).slice(2)}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ رفع صور متعددة: field name = "images"
router.post("/images", upload.array("images", 10), (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const files = (req.files as Express.Multer.File[]) || [];
  const urls = files.map((f) => `${base}/uploads/${f.filename}`);
  res.json({ urls });
});

export default router;