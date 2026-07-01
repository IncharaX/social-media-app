import React from "react";
import { Bell, Home, LogIn, LogOut, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import { StatusPill } from "./StatusPill.jsx";

const baseNavItems = [
  { to: "/", label: "Feed", icon: Home },
  { to: "/profile", label: "Profile", icon: UserRound }
];

export function AppLayout() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark">U</div>
          <div>
            <p className="eyebrow">Unlox</p>
            <h1>Social</h1>
          </div>
        </div>

        <nav className="nav-list" aria-label="Primary">
          {baseNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {isAuthenticated ? (
            <button className="nav-item nav-button" type="button" onClick={logout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav-item ${isActive ? "is-active" : ""}`}
            >
              <LogIn size={18} />
              <span>Login</span>
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          {user ? (
            <div className="mini-user">
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
            </div>
          ) : null}
          <StatusPill />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div>
            <p className="eyebrow">Week 07 Minor Project</p>
            <h2>Full stack social feed</h2>
          </div>
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={20} />
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
}
