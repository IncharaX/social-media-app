import React from "react";
import {
  Check,
  Edit3,
  Heart,
  MessageCircle,
  SendHorizonal,
  Trash2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import {
  createPost,
  deletePost,
  getPosts,
  likePost,
  unlikePost,
  updatePost
} from "../services/postService.js";

function formatPostTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function FeedPage() {
  const { isAuthenticated, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [editDraft, setEditDraft] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [busyLikeId, setBusyLikeId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getPosts()
      .then((items) => {
        if (!ignore) setPosts(items);
      })
      .catch(() => {
        if (!ignore) setError("Could not load the feed. Check that the backend is running.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function handleCreatePost(event) {
    event.preventDefault();

    if (!draft.trim()) {
      setError("Write something before posting.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const post = await createPost(draft);
      setPosts((current) => [post, ...current]);
      setDraft("");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not create the post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startEditing(post) {
    setEditingPostId(post.id);
    setEditDraft(post.description);
    setError("");
  }

  function cancelEditing() {
    setEditingPostId(null);
    setEditDraft("");
  }

  async function handleUpdatePost(postId) {
    if (!editDraft.trim()) {
      setError("Post description cannot be empty.");
      return;
    }

    setError("");

    try {
      const updatedPost = await updatePost(postId, editDraft);
      setPosts((current) =>
        current.map((post) => (post.id === postId ? updatedPost : post))
      );
      cancelEditing();
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update the post.");
    }
  }

  async function handleDeletePost(postId) {
    setError("");

    try {
      await deletePost(postId);
      setPosts((current) => current.filter((post) => post.id !== postId));
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not delete the post.");
    }
  }

  async function handleToggleLike(post) {
    if (!isAuthenticated) {
      setError("Login to like posts.");
      return;
    }

    setBusyLikeId(post.id);
    setError("");

    try {
      const updatedPost = post.likedByViewer
        ? await unlikePost(post.id)
        : await likePost(post.id);

      setPosts((current) =>
        current.map((item) => (item.id === post.id ? updatedPost : item))
      );
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update like.");
    } finally {
      setBusyLikeId(null);
    }
  }

  return (
    <section className="content-grid">
      <div className="feed-column">
        <form className="composer-panel" onSubmit={handleCreatePost}>
          <div className="avatar">{user ? user.name.charAt(0).toUpperCase() : "U"}</div>
          <div className="composer-body">
            <textarea
              disabled={!isAuthenticated || isSubmitting}
              maxLength="500"
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                isAuthenticated ? "Share something useful..." : "Login first to start posting"
              }
              rows="3"
              value={draft}
            />
            <div className="composer-actions">
              <p>{draft.length}/500</p>
              {isAuthenticated ? (
                <button disabled={isSubmitting} type="submit">
                  <SendHorizonal size={17} />
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              ) : (
                <Link className="button-link" to="/login">
                  Login
                </Link>
              )}
            </div>
          </div>
        </form>

        {error ? <p className="feed-error">{error}</p> : null}

        <div className="feed-list">
          {isLoading ? <div className="loading-panel">Loading feed...</div> : null}

          {!isLoading && posts.length === 0 ? (
            <div className="empty-feed">
              <h3>No posts yet</h3>
              <p>Once someone creates a post, it will appear here with the author and timestamp.</p>
            </div>
          ) : null}

          {posts.map((post) => {
            const isOwner = user?.id === post.author.id;
            const isEditing = editingPostId === post.id;

            return (
              <article className="post-card" key={post.id}>
                <div className="post-header">
                  <div className="avatar">{post.author.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3>{post.author.name}</h3>
                    <p>
                      {post.author.email} · {formatPostTime(post.createdAt)}
                    </p>
                  </div>

                  {isOwner ? (
                    <div className="owner-actions">
                      {isEditing ? (
                        <>
                          <button
                            className="ghost-icon"
                            onClick={() => handleUpdatePost(post.id)}
                            type="button"
                            aria-label="Save post"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            className="ghost-icon"
                            onClick={cancelEditing}
                            type="button"
                            aria-label="Cancel editing"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="ghost-icon"
                            onClick={() => startEditing(post)}
                            type="button"
                            aria-label="Edit post"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            className="ghost-icon danger-icon"
                            onClick={() => handleDeletePost(post.id)}
                            type="button"
                            aria-label="Delete post"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <textarea
                    className="edit-textarea"
                    maxLength="500"
                    onChange={(event) => setEditDraft(event.target.value)}
                    rows="4"
                    value={editDraft}
                  />
                ) : (
                  <p className="post-copy">{post.description}</p>
                )}

                <div className="post-actions">
                  <button
                    className={post.likedByViewer ? "is-liked" : ""}
                    disabled={busyLikeId === post.id}
                    onClick={() => handleToggleLike(post)}
                    type="button"
                  >
                    <Heart size={18} fill={post.likedByViewer ? "currentColor" : "none"} />
                    {post.likeCount}
                  </button>
                  <button type="button" disabled>
                    <MessageCircle size={18} />0
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <aside className="insight-panel">
        <div>
          <p className="eyebrow">Build state</p>
          <h3>Post feed ready</h3>
        </div>
        <ul>
          <li>Create posts when logged in.</li>
          <li>Feed loads from MongoDB through Express.</li>
          <li>Edit and delete are limited to the author.</li>
          <li>Likes are saved per user and update instantly.</li>
        </ul>
      </aside>
    </section>
  );
}
