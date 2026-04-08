import express from "express";
import multer from "multer";
import {
  getAllSpeeches, getSpeechBySlug, adminGetAllSpeeches,
  createSpeech, updateSpeech, deleteSpeech,
  uploadSpeechImage, deleteImage,
} from "../controllers/speechController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
});

/* PUBLIC */
router.get("/", getAllSpeeches);
router.get("/slug/:slug", getSpeechBySlug);

/* ADMIN */
router.get("/admin", requireAuth, requireAdmin, adminGetAllSpeeches);
router.post("/admin", requireAuth, requireAdmin, createSpeech);
router.put("/admin/:id", requireAuth, requireAdmin, updateSpeech);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteSpeech);
router.post("/admin/upload", requireAuth, requireAdmin, upload.single("image"), uploadSpeechImage);
router.post("/admin/delete-image", requireAuth, requireAdmin, deleteImage);

export default router;
