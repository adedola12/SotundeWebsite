import express from "express";
import multer from "multer";
import { getAllBooks, adminGetAllBooks, createBook, updateBook, deleteBook, uploadBookImage } from "../controllers/bookController.js";
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

router.get("/", getAllBooks);
router.get("/admin", requireAuth, requireAdmin, adminGetAllBooks);
router.post("/admin", requireAuth, requireAdmin, createBook);
router.put("/admin/:id", requireAuth, requireAdmin, updateBook);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteBook);
router.post("/admin/upload", requireAuth, requireAdmin, upload.single("image"), uploadBookImage);

export default router;
