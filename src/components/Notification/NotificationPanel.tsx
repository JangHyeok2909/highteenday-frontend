import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BellOff } from "lucide-react";
import { useNotification } from "../../contexts/NotificationContext";
import { useAuth } from "../../contexts/AuthContext";
import NotificationItem from "./NotificationItem";
import { AppNotification } from "../../types/models";
import { Button, EmptyState, Spinner } from "../ui";
import "./NotificationPanel.css";

function getNotificationPath(notification: AppNotification): string {
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

interface NotificationPanelProps {
  bellRef: React.RefObject<HTMLDivElement | null>;
}

export default function NotificationPanel({ bellRef }: NotificationPanelProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const { isLogin } = useAuth();
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
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        bellRef?.current &&
        !bellRef.current.contains(target)
      ) {
        setPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [setPanelOpen, bellRef]);

  const handleClick = async (notification: AppNotification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    const path = getNotificationPath(notification);
    setPanelOpen(false);
    navigate(path);
  };

  if (!isLogin) {
    return (
      <div className="noti-panel" ref={panelRef}>
        <div className="noti-panel__header">
          <h3 className="noti-panel__title">알림</h3>
        </div>
        <EmptyState
          icon={<BellOff size={32} />}
          message="로그인이 필요한 서비스입니다."
          action={
            <Button
              size="sm"
              onClick={() => {
                setPanelOpen(false);
                navigate("/login");
              }}
            >
              로그인하러 가기
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="noti-panel" ref={panelRef}>
      <div className="noti-panel__header">
        <h3 className="noti-panel__title">알림</h3>
        <div className="noti-panel__actions">
          <button
            type="button"
            className="noti-panel__action"
            onClick={markAllAsRead}
            disabled={notifications.every((n) => n.isRead)}
          >
            모두 읽음
          </button>
          <button
            type="button"
            className="noti-panel__action"
            onClick={deleteAllRead}
            disabled={!notifications.some((n) => n.isRead)}
          >
            읽은 알림 삭제
          </button>
        </div>
      </div>

      <div className="noti-panel__body">
        {error && (
          <div className="noti-panel__error">
            <p>{error}</p>
            <Button size="sm" variant="secondary" onClick={fetchNotifications}>
              다시 시도
            </Button>
          </div>
        )}

        {!error && notifications.length === 0 && !isLoading && (
          <EmptyState
            icon={<BellOff size={32} />}
            message="새로운 알림이 없습니다."
          />
        )}

        {notifications.map((n) => (
          <NotificationItem
            key={n.id}
            notification={n}
            onClick={handleClick}
            onDelete={deleteNotification}
          />
        ))}

        {isLoading && (
          <div className="noti-panel__loading">
            <Spinner size={20} />
          </div>
        )}

        {!isLoading && hasMore && (
          <button type="button" className="noti-panel__more" onClick={loadMore}>
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}
