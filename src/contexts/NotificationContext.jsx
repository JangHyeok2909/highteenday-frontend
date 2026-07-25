import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "./WebSocketContext";

const NotificationContext = createContext(undefined);

const PAGE_SIZE = 20;

export function NotificationProvider({ children }) {
  const { isLogin, user } = useAuth();
  const { connected, subscribe } = useWebSocket();

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const hasMore = page + 1 < totalPages;
  const subscriptionRef = useRef(null);

  // ── 초기 안읽은 수 조회 ──
  const fetchUnreadCount = useCallback(async () => {
    if (!isLogin) return;
    try {
      const { data } = await axios.get("/api/notifications/unread-count", {
        withCredentials: true,
      });
      setUnreadCount(typeof data === "number" ? data : 0);
    } catch {
      // silently ignore
    }
  }, [isLogin]);

  // ── WebSocket 구독 (실시간 알림 수신) ──
  useEffect(() => {
    if (!isLogin || !connected || !user) {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (!isLogin) {
        setUnreadCount(0);
        setNotifications([]);
      }
      return;
    }

    // 초기 안읽은 수 로드
    fetchUnreadCount();

    // 실시간 알림 구독
    const sub = subscribe(`/topic/notifications/${user.id}`, (notification) => {
      setUnreadCount((c) => c + 1);
      setNotifications((prev) => [notification, ...prev]);
    });
    subscriptionRef.current = sub;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [isLogin, connected, user, subscribe, fetchUnreadCount]);

  // ── Fetch notifications (initial + reset) ──
  const fetchNotifications = useCallback(async () => {
    if (!isLogin) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get("/api/notifications", {
        params: { page: 0, size: PAGE_SIZE },
        withCredentials: true,
      });
      setNotifications(data.notifications || []);
      setPage(0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      setError("알림을 불러오지 못했습니다.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLogin]);

  // Fetch when panel opens
  const prevPanelOpen = useRef(false);
  useEffect(() => {
    if (panelOpen && !prevPanelOpen.current && isLogin) {
      fetchNotifications();
      fetchUnreadCount();
    }
    prevPanelOpen.current = panelOpen;
  }, [panelOpen, isLogin, fetchNotifications, fetchUnreadCount]);

  // ── Load more ──
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !isLogin) return;
    const nextPage = page + 1;
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/notifications", {
        params: { page: nextPage, size: PAGE_SIZE },
        withCredentials: true,
      });
      setNotifications((prev) => [...prev, ...(data.notifications || [])]);
      setPage(nextPage);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page, isLogin]);

  // ── Mark as read ──
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((c) => Math.max(0, c - 1));

    try {
      const { data } = await axios.patch(`/api/notifications/${id}/read`, null, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n))
      );
      setUnreadCount((c) => c + 1);
      console.error(err);
      return null;
    }
  }, []);

  // ── Mark all as read ──
  const markAllAsRead = useCallback(async () => {
    const backup = { notifications: [...notifications], unreadCount };
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await axios.patch("/api/notifications/read-all", null, {
        withCredentials: true,
      });
    } catch (err) {
      setNotifications(backup.notifications);
      setUnreadCount(backup.unreadCount);
      console.error(err);
    }
  }, [notifications, unreadCount]);

  // ── Delete all read notifications ──
  const deleteAllRead = useCallback(async () => {
    const readItems = notifications.filter((n) => n.isRead);
    if (readItems.length === 0) return;

    setNotifications((prev) => prev.filter((n) => !n.isRead));

    try {
      await axios.delete("/api/notifications/read", {
        withCredentials: true,
      });
    } catch (err) {
      setNotifications((prev) => [...prev, ...readItems]);
      console.error(err);
    }
  }, [notifications]);

  // ── Delete notification ──
  const deleteNotification = useCallback(async (id) => {
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.isRead) setUnreadCount((c) => Math.max(0, c - 1));

    try {
      await axios.delete(`/api/notifications/${id}`, {
        withCredentials: true,
      });
    } catch (err) {
      setNotifications((prev) => {
        const restored = [...prev];
        if (target) restored.push(target);
        return restored;
      });
      if (target && !target.isRead) setUnreadCount((c) => c + 1);
      console.error(err);
    }
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        unreadCount,
        notifications,
        hasMore,
        isLoading,
        error,
        panelOpen,
        setPanelOpen,
        fetchNotifications,
        loadMore,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("NotificationProvider 안에서만 사용 가능합니다.");
  return ctx;
}
