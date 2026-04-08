import express from "express";
import {
  submitContact, getAllContacts, markContactRead, deleteContact,
  subscribe, getAllSubscribers,
} from "../controllers/contactController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/* PUBLIC */
router.post("/", submitContact);
router.post("/subscribe", subscribe);

/* ADMIN */
router.get("/admin", requireAuth, requireAdmin, getAllContacts);
router.put("/admin/:id/read", requireAuth, requireAdmin, markContactRead);
router.delete("/admin/:id", requireAuth, requireAdmin, deleteContact);
router.get("/admin/subscribers", requireAuth, requireAdmin, getAllSubscribers);

export default router;
