import { Post } from "../models/Post.js";
import { User } from "../models/User.js";
import { httpError } from "../utils/httpError.js";

const editableFields = ["name", "bio", "location", "avatarUrl"];

export async function getProfile(req, res, next) {
  try {
    const postCount = await Post.countDocuments({ author: req.user._id });

    res.json({
      user: req.user.toSafeObject(),
      stats: {
        posts: postCount,
        followers: req.user.followers?.length || 0,
        following: req.user.following?.length || 0
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
        posts: postCount,
        followers: req.user.followers?.length || 0,
        following: req.user.following?.length || 0
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      throw httpError(400, "Choose an image to upload");
    }

    req.user.avatarUrl = `/uploads/${req.file.filename}`;
    await req.user.save();

    res.json({
      user: req.user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
}

export async function followUser(req, res, next) {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      throw httpError(404, "User not found");
    }

    if (targetUser._id.toString() === req.user._id.toString()) {
      throw httpError(400, "You cannot follow yourself");
    }

    const alreadyFollowing = req.user.following.some(
      (id) => id.toString() === targetUser._id.toString()
    );

    if (!alreadyFollowing) {
      req.user.following.push(targetUser._id);
      targetUser.followers.push(req.user._id);
      await req.user.save();
      await targetUser.save();
    }

    res.json({
      following: true,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      throw httpError(404, "User not found");
    }

    req.user.following = req.user.following.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (id) => id.toString() !== req.user._id.toString()
    );

    await req.user.save();
    await targetUser.save();

    res.json({
      following: false,
      user: req.user.toSafeObject()
    });
  } catch (error) {
    next(error);
  }
}
