import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "./WebSocketContext";

const ChatContext = createContext(undefined);

export function ChatProvider({ children }) {
  const { isLogin } = useAuth();
  const { connected, subscribe, publish } = useWebSocket();

  const [chatRooms, setChatRooms] = useState([]);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const subscriptionsRef = useRef({});
  const globalSubsRef = useRef({});
  const activeRoomRef = useRef(null);

  const fetchChatRooms = useCallback(async () => {
    if (!isLogin) return;
    try {
      const { data } = await axios.get("/api/chat/rooms", { withCredentials: true });
      setChatRooms(data);
      const total = data.reduce((sum, room) => sum + (room.unreadCount || 0), 0);
      setTotalUnreadCount(total);
    } catch {
      // silently ignore
    }
  }, [isLogin]);

  // 모든 채팅방을 글로벌 구독하여 목록 실시간 업데이트
  useEffect(() => {
    if (!connected || chatRooms.length === 0) return;

    const currentRoomIds = chatRooms.map((r) => r.roomId);

    // 더 이상 존재하지 않는 방의 구독 해제
    Object.keys(globalSubsRef.current).forEach((id) => {
      const numId = Number(id);
      if (!currentRoomIds.includes(numId)) {
        try { globalSubsRef.current[id].unsubscribe(); } catch { /* ignore */ }
        delete globalSubsRef.current[id];
      }
    });

    // 새 방 구독
    currentRoomIds.forEach((roomId) => {
      if (globalSubsRef.current[roomId]) return;

      const sub = subscribe(`/topic/chat/room/${roomId}`, (msg) => {
        setChatRooms((prev) => {
          const updated = prev.map((room) => {
            if (room.roomId !== roomId) return room;
            const isActive = activeRoomRef.current === roomId;
            return {
              ...room,
              lastMessage: msg.content,
              lastMessageAt: msg.createdAt,
              unreadCount: isActive ? room.unreadCount : (room.unreadCount || 0) + 1,
            };
          });
          // 최신 메시지 방을 맨 위로 정렬
          updated.sort((a, b) => {
            const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return tb - ta;
          });
          return updated;
        });

        if (activeRoomRef.current !== roomId) {
          setTotalUnreadCount((prev) => prev + 1);
        }
      });

      if (sub) {
        globalSubsRef.current[roomId] = sub;
      }
    });

    return () => {
      Object.values(globalSubsRef.current).forEach((sub) => {
        try { sub.unsubscribe(); } catch { /* ignore */ }
      });
      globalSubsRef.current = {};
    };
  }, [connected, chatRooms.length, subscribe]);

  useEffect(() => {
    if (!isLogin) {
      setChatRooms([]);
      setTotalUnreadCount(0);
      return;
    }
    if (connected) {
      fetchChatRooms();
    }
  }, [isLogin, connected, fetchChatRooms]);

  const setActiveRoom = useCallback((roomId) => {
    activeRoomRef.current = roomId;
  }, []);

  const subscribeChatRoom = useCallback((roomId, onMessage) => {
    if (subscriptionsRef.current[roomId]) {
      subscriptionsRef.current[roomId].unsubscribe();
      delete subscriptionsRef.current[roomId];
    }

    // 글로벌 구독이 목록 업데이트를 처리하므로, 여기서는 onMessage 콜백만 등록
    activeRoomRef.current = roomId;

    const subscription = subscribe(`/topic/chat/room/${roomId}`, (msg) => {
      onMessage(msg);
    });

    if (subscription) {
      subscriptionsRef.current[roomId] = subscription;
    }
    return subscription;
  }, [subscribe]);

  const unsubscribeChatRoom = useCallback((roomId) => {
    const sub = subscriptionsRef.current[roomId];
    if (sub) {
      try { sub.unsubscribe(); } catch { /* already unsubscribed */ }
      delete subscriptionsRef.current[roomId];
    }
    if (activeRoomRef.current === roomId) {
      activeRoomRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((roomId, content, imageUrl = null) => {
    publish("/app/chat/send", { roomId, content, imageUrl });
  }, [publish]);

  const markAsRead = useCallback(async (roomId) => {
    try {
      await axios.patch(`/api/chat/rooms/${roomId}/read`, null, { withCredentials: true });
      setChatRooms((prev) => {
        const room = prev.find((r) => r.roomId === roomId);
        const cleared = room?.unreadCount || 0;
        if (cleared > 0) {
          setTotalUnreadCount((t) => Math.max(0, t - cleared));
        }
        return prev.map((r) =>
          r.roomId === roomId ? { ...r, unreadCount: 0 } : r
        );
      });
    } catch {
      // silently ignore
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        chatRooms,
        totalUnreadCount,
        fetchChatRooms,
        subscribe: subscribeChatRoom,
        unsubscribe: unsubscribeChatRoom,
        sendMessage,
        markAsRead,
        setActiveRoom,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
}
