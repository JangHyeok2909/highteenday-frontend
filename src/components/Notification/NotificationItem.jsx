import React from "react";
import { formatRelativeTime } from "../../utils/dateFormat";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./NotificationItem.css";

const CATEGORY_META = {
  POST_COMMENT:    { icon: "💬", color: "#3b82f6" },
  COMMENT_REPLY:   { icon: "↩️",  color: "#22c55e" },
  FRIEND_REQUEST:  { icon: "👤", color: "#f97316" },
  FRIEND_ACCEPT:   { icon: "✅", color: "#22c55e" },
  POST_TRENDING:   { icon: "🔥", color: "#ef4444" },
  POST_LIKE_THRESHOLD: { icon: "❤️", color: "#ef4444" },
  FRIEND_BIRTHDAY: { icon: "🎂", color: "#a855f7" },
};

export default function NotificationItem({ notification, onClick, onDelete }) {
  const { id, category, senderNickname, senderProfileUrl, message, contentMessage, isRead, createdAt } = notification;
  const meta = CATEGORY_META[category] || { icon: "🔔", color: "#6b7280" };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`notification-item ${isRead ? "read" : "unread"}`}
      onClick={() => onClick(notification)}
    >
      <div className="noti-avatar-wrap">
        <img
          src={senderProfileUrl || defaultProfile}
          alt={senderNickname || "알림"}
          className="noti-avatar"
          onError={(e) => { e.target.src = defaultProfile; }}
        />
        <span className="noti-category-badge" style={{ backgroundColor: meta.color }}>
          {meta.icon}
        </span>
      </div>

      <div className="noti-content">
        <p className={`noti-message ${isRead ? "" : "bold"}`}>{message}</p>
        {contentMessage && (
          <p className="noti-sub">{contentMessage}</p>
        )}
        <span className="noti-time">{formatRelativeTime(createdAt)}</span>
      </div>

      <button className="noti-delete-btn" onClick={handleDelete} title="삭제">
        ✕
      </button>
    </div>
  );
}
