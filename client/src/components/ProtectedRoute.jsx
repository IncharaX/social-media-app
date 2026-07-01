import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isBooting } = useAuth();

  if (isBooting) {
    return <div className="loading-panel">Checking your session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
