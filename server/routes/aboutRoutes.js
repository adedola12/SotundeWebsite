import express from "express";
import multer from "multer";
import {
  getAllAboutSections, getAboutSection, upsertAboutSection, uploadAboutImage,
} from "../controllers/aboutController.js";
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
router.get("/", getAllAboutSections);
router.get("/:section", getAboutSection);

/* ADMIN */
router.post("/admin", requireAuth, requireAdmin, upsertAboutSection);
router.post("/admin/upload", requireAuth, requireAdmin, upload.single("image"), uploadAboutImage);

export default router;
