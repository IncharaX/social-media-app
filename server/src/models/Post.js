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
    ]
  },
  {
    timestamps: true
  }
);

postSchema.methods.toFeedObject = function toFeedObject(viewerId = null) {
  const author = this.author;
  const likes = this.likes || [];
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
    likeCount: likes.length,
    likedByViewer: viewer ? likes.some((id) => id.toString() === viewer) : false,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const Post = mongoose.model("Post", postSchema);
