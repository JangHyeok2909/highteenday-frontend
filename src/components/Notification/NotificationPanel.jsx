import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../contexts/NotificationContext";
import NotificationItem from "./NotificationItem";
import "./NotificationPanel.css";

function getNotificationPath(notification) {
  const { category, entityId } = notification;
  switch (category) {
    case "POST_COMMENT":
    case "COMMENT_REPLY":
    case "POST_TRENDING":
    case "POST_LIKE_THRESHOLD":
      return entityId ? `/board/post/${entityId}` : "/";
    case "FRIEND_REQUEST":
    case "FRIEND_ACCEPT":
    case "FRIEND_BIRTHDAY":
      return "/friend";
    default:
      return "/";
  }
}

export default function NotificationPanel({ bellRef }) {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const {
    notifications,
    hasMore,
    isLoading,
    error,
    setPanelOpen,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllRead,
  } = useNotification();

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        bellRef?.current && !bellRef.current.contains(e.target)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setPanelOpen, bellRef]);

  const handleClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    const path = getNotificationPath(notification);
    setPanelOpen(false);
    navigate(path);
  };

  const handleDelete = (id) => {
    deleteNotification(id);
  };

  return (
    <div className="notification-panel" ref={panelRef}>
      <div className="noti-panel-header">
        <h3 className="noti-panel-title">알림</h3>
        <div className="noti-header-actions">
          <button
            className="noti-mark-all-btn"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
          >
            모두 읽음
          </button>
          <button
            className="noti-delete-read-btn"
            onClick={deleteAllRead}
            disabled={!notifications.some((n) => n.isRead)}
          >
            읽은 알림 삭제
          </button>
        </div>
      </div>

      <div className="noti-panel-body">
        {error && (
          <div className="noti-panel-error">
            <p>{error}</p>
            <button onClick={fetchNotifications}>다시 시도</button>
          </div>
        )}

        {!error && notifications.length === 0 && !isLoading && (
          <div className="noti-panel-empty">
            <span className="noti-empty-icon">🔔</span>
            <p>새로운 알림이 없습니다.</p>
          </div>
        )}

        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onClick={handleClick}
            onDelete={handleDelete}
          />
        ))}

        {isLoading && (
          <div className="noti-panel-loading">불러오는 중...</div>
        )}

        {!isLoading && hasMore && (
          <button className="noti-load-more-btn" onClick={loadMore}>
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}
