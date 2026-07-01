import React from "react";
import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

export function LoginPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "register") {
        await register(form);
      } else {
        await login({
          email: form.email,
          password: form.password
        });
      }

      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Authentication failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  return (
    <main className="auth-page">
      <section className="auth-panel">
        <Link className="back-link" to="/">
          Back to feed
        </Link>
        <p className="eyebrow">Account access</p>
        <h1>{mode === "login" ? "Sign in to continue" : "Create your account"}</h1>

        <div className="auth-tabs" aria-label="Authentication mode">
          <button
            className={mode === "login" ? "is-active" : ""}
            type="button"
            onClick={() => switchMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "is-active" : ""}
            type="button"
            onClick={() => switchMode("register")}
          >
            Register
          </button>
        </div>

        {error ? <p className="form-error">{error}</p> : null}

        <form onSubmit={handleSubmit}>
          {mode === "register" ? (
            <label>
              Name
              <span className="field-control">
                <UserRound size={18} />
                <input
                  name="name"
                  onChange={updateField}
                  placeholder="Your name"
                  required
                  type="text"
                  value={form.name}
                />
              </span>
            </label>
          ) : null}

          <label>
            Email
            <span className="field-control">
              <Mail size={18} />
              <input
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </span>
          </label>

          <label>
            Password
            <span className="field-control">
              <LockKeyhole size={18} />
              <input
                minLength="6"
                name="password"
                onChange={updateField}
                placeholder="At least 6 characters"
                required
                type="password"
                value={form.password}
              />
            </span>
          </label>

          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}
