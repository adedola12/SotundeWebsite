import express from "express";
import { signup, signin, signout, me } from "../controllers/authController.js";
import { requireAuth, requireAdmin } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

// Allow first admin creation without auth, lock down after
router.post("/signup", async (req, res, next) => {
  const adminCount = await User.countDocuments({ userType: "admin" });
  if (adminCount === 0) return next(); // first admin — skip auth
  return requireAuth(req, res, () => requireAdmin(req, res, next));
}, signup);

router.post("/signin", signin);
router.post("/signout", signout);
router.get("/me", requireAuth, me);

export default router;
