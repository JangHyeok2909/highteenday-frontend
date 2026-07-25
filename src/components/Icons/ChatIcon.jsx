import React from "react";
import { MessageCircle } from "lucide-react";
import "./Icons.css";

function ChatIcon({ size, color, count }) {
  const displayCount = count > 99 ? "99+" : count;

  return (
    <div className="chat-icon-container lucide-icon">
      <MessageCircle color={color} size={size} />
      {count > 0 && <span className="chat-icon-badge">{displayCount}</span>}
    </div>
  );
}

export default ChatIcon;
