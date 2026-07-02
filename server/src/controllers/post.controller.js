import { Post } from "../models/Post.js";
import { httpError } from "../utils/httpError.js";

const authorFields = "name email avatarUrl followers";

async function populatePost(post) {
  await post.populate("author", authorFields);
  await post.populate("comments.author", "name avatarUrl");
  return post;
}

function ensurePostOwner(post, userId) {
  if (post.author._id.toString() !== userId.toString()) {
    throw httpError(403, "You can only change your own posts");
  }
}

export async function createPost(req, res, next) {
  try {
    const { description } = req.body;

    if (!description || !description.trim()) {
      throw httpError(400, "Write something before posting");
    }

    const post = await Post.create({
      author: req.user._id,
      description
    });

    await populatePost(post);

    res.status(201).json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function getPosts(req, res, next) {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", authorFields)
      .populate("comments.author", "name avatarUrl");

    res.json({
      posts: posts.map((post) => post.toFeedObject(req.user?._id))
    });
  } catch (error) {
    next(error);
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    await populatePost(post);

    res.json({
      post: post.toFeedObject(req.user?._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function addComment(req, res, next) {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    if (!text || !text.trim()) {
      throw httpError(400, "Comment cannot be empty");
    }

    post.comments.push({
      author: req.user._id,
      text
    });

    await post.save();
    await populatePost(post);

    res.status(201).json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      throw httpError(404, "Comment not found");
    }

    const canDelete =
      comment.author.toString() === req.user._id.toString() ||
      post.author.toString() === req.user._id.toString();

    if (!canDelete) {
      throw httpError(403, "You can only delete your own comments");
    }

    comment.deleteOne();
    await post.save();
    await populatePost(post);

    res.json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const { description } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    await populatePost(post);
    ensurePostOwner(post, req.user._id);

    if (!description || !description.trim()) {
      throw httpError(400, "Post description cannot be empty");
    }

    post.description = description;
    await post.save();
    await populatePost(post);

    res.json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    await populatePost(post);
    ensurePostOwner(post, req.user._id);
    await post.deleteOne();

    res.json({
      message: "Post deleted"
    });
  } catch (error) {
    next(error);
  }
}

export async function likePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    await populatePost(post);

    const alreadyLiked = post.likes.some((id) => id.toString() === req.user._id.toString());

    if (!alreadyLiked) {
      post.likes.push(req.user._id);
      await post.save();
      await populatePost(post);
    }

    res.json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function unlikePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw httpError(404, "Post not found");
    }

    await populatePost(post);

    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString());
    await post.save();
    await populatePost(post);

    res.json({
      post: post.toFeedObject(req.user._id)
    });
  } catch (error) {
    next(error);
  }
}
