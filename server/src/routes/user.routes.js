import { Router } from "express";
import {
  followUser,
  getProfile,
  unfollowUser,
  updateProfile,
  uploadAvatar
} from "../controllers/user.controller.js";
import { upload } from "../config/upload.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/me", protect, getProfile);
router.patch("/me", protect, updateProfile);
router.post("/me/avatar", protect, upload.single("avatar"), uploadAvatar);
router.post("/:id/follow", protect, followUser);
router.delete("/:id/follow", protect, unfollowUser);

export default router;
