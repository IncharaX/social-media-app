import React from "react";

export function Avatar({ name, src, size = "md" }) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const serverUrl = apiBase.replace(/\/api\/?$/, "");
  const imageSrc = src?.startsWith("/uploads") ? `${serverUrl}${src}` : src;

  return (
    <div className={`avatar avatar-${size}`}>
      {imageSrc ? <img alt="" src={imageSrc} /> : initial}
    </div>
  );
}
