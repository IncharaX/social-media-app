import React, { useEffect, useRef, useState } from "react";
import { SendHorizonal } from "lucide-react";
import { useAuth } from "../services/AuthContext.jsx";
import { createChatSocket } from "../services/socket.js";

export function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = createChatSocket();
    socketRef.current = socket;

    socket.on("chat:history", setMessages);
    socket.on("chat:message", (message) => {
      setMessages((current) => [...current, message].slice(-30));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function sendMessage(event) {
    event.preventDefault();

    if (!text.trim()) return;

    socketRef.current?.emit("chat:message", {
      userName: user?.name || "Guest",
      text
    });
    setText("");
  }

  return (
    <div className="chat-panel">
      <div>
        <p className="eyebrow">Live room</p>
        <h3>Real-time chat</h3>
      </div>
      <div className="chat-messages">
        {messages.length === 0 ? <p className="muted-copy">No messages yet.</p> : null}
        {messages.map((message) => (
          <div className="chat-message" key={message.id}>
            <strong>{message.userName}</strong>
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={sendMessage}>
        <input
          maxLength="240"
          onChange={(event) => setText(event.target.value)}
          placeholder="Send a message..."
          value={text}
        />
        <button type="submit" aria-label="Send chat message">
          <SendHorizonal size={17} />
        </button>
      </form>
    </div>
  );
}
