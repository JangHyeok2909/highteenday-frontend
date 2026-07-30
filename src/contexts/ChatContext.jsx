import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useWebSocket } from "./WebSocketContext";

const ChatContext = createContext(undefined);

// 재전송 멱등성 키. 같은 값으로 두 번 올라가면 서버가 한 번만 저장한다.
const newClientMsgId = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID)
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

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
      setTotalUnreadCount(data.reduce((sum, room) => sum + (room.unreadCount || 0), 0));
    } catch {
      // silently ignore
    }
  }, [isLogin]);

  // 모든 채팅방을 글로벌 구독하여 목록을 실시간 갱신한다.
  useEffect(() => {
    if (!connected || chatRooms.length === 0) return;

    const currentRoomIds = chatRooms.map((r) => r.roomId);

    Object.keys(globalSubsRef.current).forEach((id) => {
      if (!currentRoomIds.includes(Number(id))) {
        try { globalSubsRef.current[id].unsubscribe(); } catch { /* ignore */ }
        delete globalSubsRef.current[id];
      }
    });

    currentRoomIds.forEach((roomId) => {
      if (globalSubsRef.current[roomId]) return;

      const sub = subscribe(`/topic/chat/room/${roomId}`, (msg) => {
        setChatRooms((prev) => {
          const updated = prev.map((room) => {
            if (room.roomId !== roomId) return room;
            const isActive = activeRoomRef.current === roomId;
            // SYSTEM 메시지는 안읽음으로 세지 않는다. 서버 집계와 기준을 맞춘 것.
            const countsAsUnread = !isActive && msg.type !== "SYSTEM";
            return {
              ...room,
              lastMessage: msg.type === "IMAGE" ? "사진" : msg.content,
              lastMessageAt: msg.createdAt,
              unreadCount: countsAsUnread ? (room.unreadCount || 0) + 1 : room.unreadCount,
            };
          });
          updated.sort((a, b) => {
            const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
            const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
            return tb - ta;
          });
          return updated;
        });

        if (activeRoomRef.current !== roomId && msg.type !== "SYSTEM") {
          setTotalUnreadCount((prev) => prev + 1);
        }
      });

      if (sub) globalSubsRef.current[roomId] = sub;
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
    if (connected) fetchChatRooms();
  }, [isLogin, connected, fetchChatRooms]);

  const setActiveRoom = useCallback((roomId) => {
    activeRoomRef.current = roomId;
  }, []);

  const subscribeChatRoom = useCallback((roomId, onMessage) => {
    if (subscriptionsRef.current[roomId]) {
      try { subscriptionsRef.current[roomId].unsubscribe(); } catch { /* 연결이 이미 끊김 */ }
      delete subscriptionsRef.current[roomId];
    }
    activeRoomRef.current = roomId;

    const subscription = subscribe(`/topic/chat/room/${roomId}`, (msg) => onMessage(msg));
    if (subscription) subscriptionsRef.current[roomId] = subscription;
    return subscription;
  }, [subscribe]);

  const unsubscribeChatRoom = useCallback((roomId) => {
    const sub = subscriptionsRef.current[roomId];
    if (sub) {
      try { sub.unsubscribe(); } catch { /* already unsubscribed */ }
      delete subscriptionsRef.current[roomId];
    }
    if (activeRoomRef.current === roomId) activeRoomRef.current = null;
  }, []);

  // 연결이 끊긴 상태에서 publish는 아무 일도 하지 않으므로 성공 여부를 그대로 넘긴다.
  const sendMessage = useCallback((roomId, content, imageUrl = null) => {
    return publish("/app/chat/send", {
      roomId,
      content,
      imageUrl,
      clientMsgId: newClientMsgId(),
    });
  }, [publish]);

  // lastMsgId를 함께 보내 "어디까지 읽었는지"를 정확히 남긴다.
  const markAsRead = useCallback(async (roomId, lastMsgId = null) => {
    try {
      const query = lastMsgId != null ? `?lastMsgId=${lastMsgId}` : "";
      await axios.patch(`/api/chat/rooms/${roomId}/read${query}`, null, { withCredentials: true });
      setChatRooms((prev) => {
        const room = prev.find((r) => r.roomId === roomId);
        const cleared = room?.unreadCount || 0;
        if (cleared > 0) setTotalUnreadCount((t) => Math.max(0, t - cleared));
        return prev.map((r) => (r.roomId === roomId ? { ...r, unreadCount: 0 } : r));
      });
    } catch {
      // silently ignore
    }
  }, []);

  // ---------------- 단체방 ----------------

  const createGroupRoom = useCallback(async (name, memberIds) => {
    const { data } = await axios.post(
      "/api/chat/rooms/group",
      { name, memberIds },
      { withCredentials: true }
    );
    await fetchChatRooms();
    return data;
  }, [fetchChatRooms]);

  const inviteMembers = useCallback(async (roomId, memberIds) => {
    const { data } = await axios.post(
      `/api/chat/rooms/${roomId}/members`,
      { memberIds },
      { withCredentials: true }
    );
    return data;
  }, []);

  const leaveRoom = useCallback(async (roomId) => {
    await axios.delete(`/api/chat/rooms/${roomId}/members/me`, { withCredentials: true });
    setChatRooms((prev) => prev.filter((r) => r.roomId !== roomId));
  }, []);

  const kickMember = useCallback(async (roomId, userId) => {
    await axios.delete(`/api/chat/rooms/${roomId}/members/${userId}`, { withCredentials: true });
  }, []);

  const updateRoomName = useCallback(async (roomId, name) => {
    const { data } = await axios.patch(
      `/api/chat/rooms/${roomId}`,
      { name },
      { withCredentials: true }
    );
    setChatRooms((prev) =>
      prev.map((r) => (r.roomId === roomId ? { ...r, roomName: data.roomName } : r))
    );
    return data;
  }, []);

  const fetchMembers = useCallback(async (roomId) => {
    const { data } = await axios.get(`/api/chat/rooms/${roomId}/members`, {
      withCredentials: true,
    });
    return data;
  }, []);

  // 1:1 방은 이미 있으면 그 방을 그대로 돌려준다(서버가 pairKey로 판단).
  // 친구 목록에만 인라인으로 있던 것을 프로필 카드에서도 쓰려고 올렸다.
  const startPrivateRoom = useCallback(async (friendId) => {
    const { data } = await axios.post(
      "/api/chat/rooms",
      { friendId },
      { withCredentials: true }
    );
    await fetchChatRooms();
    return data;
  }, [fetchChatRooms]);

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
        createGroupRoom,
        inviteMembers,
        leaveRoom,
        kickMember,
        updateRoomName,
        fetchMembers,
        startPrivateRoom,
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
