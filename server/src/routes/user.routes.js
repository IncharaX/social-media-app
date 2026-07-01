import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);

export default router;
