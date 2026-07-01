import React from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export function StatusPill() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    let ignore = false;

    api
      .get("/health")
      .then(() => {
        if (!ignore) setStatus("online");
      })
      .catch(() => {
        if (!ignore) setStatus("offline");
      });

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className={`status-pill status-${status}`}>
      <span />
      <p>API {status}</p>
    </div>
  );
}
