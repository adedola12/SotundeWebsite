import express from "express";
import multer from "multer";
import {
  getAllGallery, adminGetAllGallery, createGalleryItem,
  updateGalleryItem, deleteGalleryItem, uploadGalleryImage, deleteImage,
} from "../controllers/galleryController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video support
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only image and video files are allowed"), false);
  },
});

/* PUBLIC */
router.get("/", getAllGallery);

/* ADMIN */
router.get("/admin", requireAuth, requireAdmin, adminGetAllGallery);
router.post("/admin", requireAuth, requireAdmin, createGalleryItem);
router.put("/admin/:id", requireAuth, requireAdmin, updateGalleryItem);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteGalleryItem);
router.post("/admin/upload", requireAuth, requireAdmin, upload.single("image"), uploadGalleryImage);
router.post("/admin/delete-image", requireAuth, requireAdmin, deleteImage);

export default router;
