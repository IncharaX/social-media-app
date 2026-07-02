import { Router } from "express";
import {
  addComment,
  createPost,
  deleteComment,
  deletePost,
  getPost,
  getPosts,
  likePost,
  unlikePost,
  updatePost
} from "../controllers/post.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", protect, createPost);
router.post("/:id/like", protect, likePost);
router.delete("/:id/like", protect, unlikePost);
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);
router.patch("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
