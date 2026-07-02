import { io } from "socket.io-client";

export function createChatSocket() {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
  const serverUrl = apiBase.replace(/\/api\/?$/, "");

  return io(serverUrl, {
    transports: ["websocket", "polling"]
  });
}
