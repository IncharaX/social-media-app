import React from "react";
import { CalendarDays, Check, Edit3, Mail, MapPin, Newspaper, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../services/AuthContext.jsx";
import { getProfile, updateProfile } from "../services/userService.js";

function formatJoinDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently joined";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric"
  }).format(date);
}

function buildInitialForm(user) {
  return {
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    avatarUrl: user.avatarUrl || ""
  };
}

export function ProfilePage() {
  const { syncUser, user } = useAuth();
  const [form, setForm] = useState(() => buildInitialForm(user));
  const [stats, setStats] = useState({ posts: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    getProfile()
      .then((data) => {
        if (ignore) return;
        syncUser(data.user);
        setForm(buildInitialForm(data.user));
        setStats(data.stats);
      })
      .catch(() => {
        if (!ignore) setError("Could not refresh profile details.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [syncUser]);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function startEditing() {
    setIsEditing(true);
    setMessage("");
    setError("");
  }

  function cancelEditing() {
    setForm(buildInitialForm(user));
    setIsEditing(false);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await updateProfile(form);
      syncUser(data.user);
      setForm(buildInitialForm(data.user));
      setStats(data.stats);
      setIsEditing(false);
      setMessage("Profile updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="profile-page">
      <form onSubmit={handleSubmit}>
        <div className="profile-header">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="eyebrow">Your profile</p>
            {isEditing ? (
              <input
                className="profile-title-input"
                maxLength="60"
                name="name"
                onChange={updateField}
                required
                value={form.name}
              />
            ) : (
              <h2>{user.name}</h2>
            )}
            {isEditing ? (
              <textarea
                className="profile-bio-input"
                maxLength="160"
                name="bio"
                onChange={updateField}
                placeholder="Add a short bio"
                rows="3"
                value={form.bio}
              />
            ) : (
              <p className="profile-bio">
                {user.bio || "Building a clean full-stack social app for the Unlox Week 07 project."}
              </p>
            )}
          </div>

          {isEditing ? (
            <div className="profile-action-row">
              <button disabled={isSaving} type="submit">
                <Check size={17} />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button className="secondary-button" onClick={cancelEditing} type="button">
                <X size={17} />
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={startEditing} type="button">
              <Edit3 size={17} />
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="profile-edit-grid">
            <label>
              Location
              <span className="field-control">
                <MapPin size={18} />
                <input
                  maxLength="80"
                  name="location"
                  onChange={updateField}
                  placeholder="City, country"
                  value={form.location}
                />
              </span>
            </label>
            <label>
              Avatar URL
              <span className="field-control">
                <Newspaper size={18} />
                <input
                  name="avatarUrl"
                  onChange={updateField}
                  placeholder="Optional image URL"
                  value={form.avatarUrl}
                />
              </span>
            </label>
          </div>
        ) : null}
      </form>

      {error ? <p className="feed-error profile-message">{error}</p> : null}
      {message ? <p className="success-message profile-message">{message}</p> : null}

      <div className="profile-meta">
        <span>
          <MapPin size={17} />
          {user.location || "Location not added"}
        </span>
        <span>
          <Mail size={17} />
          {user.email}
        </span>
        <span>
          <CalendarDays size={17} />
          Joined {formatJoinDate(user.createdAt)}
        </span>
      </div>

      <div className="profile-stats">
        <div>
          <strong>{isLoading ? "..." : stats.posts}</strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>0</strong>
          <span>Following</span>
        </div>
      </div>
    </section>
  );
}
