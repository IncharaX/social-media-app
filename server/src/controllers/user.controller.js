import { Post } from "../models/Post.js";
import { httpError } from "../utils/httpError.js";

const editableFields = ["name", "bio", "location", "avatarUrl"];

export async function getProfile(req, res, next) {
  try {
    const postCount = await Post.countDocuments({ author: req.user._id });

    res.json({
      user: req.user.toSafeObject(),
      stats: {
        posts: postCount
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = {};

    editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field];
      }
    });

    if (!updates.name || !updates.name.trim()) {
      throw httpError(400, "Name is required");
    }

    Object.assign(req.user, updates);
    await req.user.save();

    const postCount = await Post.countDocuments({ author: req.user._id });

    res.json({
      user: req.user.toSafeObject(),
      stats: {
        posts: postCount
      }
    });
  } catch (error) {
    next(error);
  }
}
