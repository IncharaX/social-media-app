import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
      trim: true,
      minlength: [1, "Post cannot be empty"],
      maxlength: [500, "Post must be under 500 characters"]
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        text: {
          type: String,
          required: [true, "Comment is required"],
          trim: true,
          maxlength: [240, "Comment must be under 240 characters"]
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

postSchema.methods.toFeedObject = function toFeedObject(viewerId = null) {
  const author = this.author;
  const likes = this.likes || [];
  const comments = this.comments || [];
  const viewer = viewerId ? viewerId.toString() : null;

  return {
    id: this._id.toString(),
    description: this.description,
    author: {
      id: author._id.toString(),
      name: author.name,
      email: author.email,
      avatarUrl: author.avatarUrl
    },
    isFollowingAuthor: viewer
      ? author.followers?.some((id) => id.toString() === viewer) || false
      : false,
    likeCount: likes.length,
    likedByViewer: viewer ? likes.some((id) => id.toString() === viewer) : false,
    commentCount: comments.length,
    comments: comments.map((comment) => ({
      id: comment._id.toString(),
      text: comment.text,
      author: {
        id: comment.author._id.toString(),
        name: comment.author.name,
        avatarUrl: comment.author.avatarUrl
      },
      createdAt: comment.createdAt
    })),
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Post = mongoose.model("Post", postSchema);
