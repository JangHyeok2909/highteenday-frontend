import React from "react";
import { X } from "lucide-react";
import { formatRelativeTime } from "../../utils/dateFormat";
import { AppNotification, NotificationCategory } from "../../types/models";
import { Avatar } from "../ui";
import "./NotificationItem.css";

const CATEGORY_META: Record<NotificationCategory, { icon: string; color: string }> = {
  POST_COMMENT: { icon: "💬", color: "#3b82f6" },
  COMMENT_REPLY: { icon: "↩️", color: "#22c55e" },
  FRIEND_REQUEST: { icon: "👤", color: "#f97316" },
  FRIEND_ACCEPT: { icon: "✅", color: "#22c55e" },
  POST_TRENDING: { icon: "🔥", color: "#ef4444" },
  POST_LIKE_THRESHOLD: { icon: "❤️", color: "#ef4444" },
  FRIEND_BIRTHDAY: { icon: "🎂", color: "#a855f7" },
};

const FALLBACK_META = { icon: "🔔", color: "#6b7280" };

interface NotificationItemProps {
  notification: AppNotification;
  onClick: (notification: AppNotification) => void;
  onDelete: (id: number) => void;
}

export default function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
  const {
    id,
    category,
    senderNickname,
    senderProfileUrl,
    message,
    contentMessage,
    isRead,
    createdAt,
  } = notification;
  const meta = CATEGORY_META[category] || FALLBACK_META;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div
      className={`noti-item ${isRead ? "noti-item--read" : "noti-item--unread"}`}
      onClick={() => onClick(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick(notification)}
    >
      <div className="noti-item__avatar">
        <Avatar src={senderProfileUrl} alt={senderNickname || "알림"} size={40} />
        <span
          className="noti-item__badge"
          style={{ backgroundColor: meta.color }}
        >
          {meta.icon}
        </span>
      </div>

      <div className="noti-item__content">
        <p className={`noti-item__message ${isRead ? "" : "noti-item__message--bold"}`}>
          {message}
        </p>
        {contentMessage && <p className="noti-item__sub">{contentMessage}</p>}
        <span className="noti-item__time">{formatRelativeTime(createdAt)}</span>
      </div>

      <button
        type="button"
        className="noti-item__delete"
        onClick={handleDelete}
        aria-label="알림 삭제"
      >
        <X size={14} />
      </button>
    </div>
  );
}
