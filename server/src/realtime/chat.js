import { Server } from "socket.io";
import { env } from "../config/env.js";

const recentMessages = [];

export function attachChatServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.emit("chat:history", recentMessages);

    socket.on("chat:message", (message) => {
      const cleanMessage = {
        id: `${Date.now()}-${socket.id}`,
        userName: String(message.userName || "Guest").slice(0, 60),
        text: String(message.text || "").trim().slice(0, 240),
        createdAt: new Date().toISOString()
      };

      if (!cleanMessage.text) return;

      recentMessages.push(cleanMessage);

      if (recentMessages.length > 30) {
        recentMessages.shift();
      }

      io.emit("chat:message", cleanMessage);
    });
  });
}
