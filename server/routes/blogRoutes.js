import express from "express";
import multer from "multer";
import {
  getAllBlogs, getBlogBySlug, getFeaturedBlogs, adminGetAllBlogs,
  createBlog, updateBlog, deleteBlog, uploadBlogImage, deleteImage,
} from "../controllers/blogController.js";
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
router.get("/", getAllBlogs);
router.get("/featured", getFeaturedBlogs);
router.get("/slug/:slug", getBlogBySlug);

/* ADMIN */
router.get("/admin", requireAuth, requireAdmin, adminGetAllBlogs);
router.post("/admin", requireAuth, requireAdmin, createBlog);
router.put("/admin/:id", requireAuth, requireAdmin, updateBlog);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteBlog);
router.post("/admin/upload", requireAuth, requireAdmin, upload.single("image"), uploadBlogImage);
router.post("/admin/delete-image", requireAuth, requireAdmin, deleteImage);

export default router;
