import express from "express";
import {
  getAllVideos, adminGetAllVideos, createVideo, updateVideo, deleteVideo,
} from "../controllers/videoController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.get("/", getAllVideos);

/* ADMIN */
router.get("/admin", requireAuth, requireAdmin, adminGetAllVideos);
router.post("/admin", requireAuth, requireAdmin, createVideo);
router.put("/admin/:id", requireAuth, requireAdmin, updateVideo);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteVideo);

export default router;
