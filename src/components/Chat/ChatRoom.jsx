import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Send, ImagePlus } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import ChatMessage from "./ChatMessage";
import "../Default.css";
import "./ChatRoom.css";

const formatMinuteKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}`;
};

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribe, unsubscribe, sendMessage, markAsRead, setActiveRoom } = useChat();
  const ws = useWebSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  const [otherReadAt, setOtherReadAt] = useState(null);
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // 메시지 히스토리 + 상대 읽음 시간 로드
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/chat/rooms/${roomId}/messages`, {
          withCredentials: true,
        });
        setMessages(data);
      } catch (err) {
        console.error("메시지 로드 실패:", err);
      }
    };

    const fetchRoomInfo = async () => {
      try {
        const { data } = await axios.get("/api/chat/rooms", { withCredentials: true });
        const room = data.find((r) => r.roomId === Number(roomId));
        if (room) setRoomInfo(room);
      } catch {
        // ignore
      }
    };

    const fetchReadStatus = async () => {
      try {
        const { data } = await axios.get(`/api/chat/rooms/${roomId}/read-status`, {
          withCredentials: true,
        });
        if (data.otherReadAt) {
          setOtherReadAt(new Date(data.otherReadAt));
        }
      } catch {
        // ignore
      }
    };

    fetchMessages();
    fetchRoomInfo();
    fetchReadStatus();
    setActiveRoom(Number(roomId));
    markAsRead(Number(roomId));

    return () => setActiveRoom(null);
  }, [roomId, markAsRead, setActiveRoom]);

  // 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // STOMP 구독 (메시지 + 읽음 이벤트)
  useEffect(() => {
    if (!ws.connected) return;

    const id = Number(roomId);
    subscribe(id, (msg) => {
      setMessages((prev) => [...prev, msg]);
      markAsRead(id);
    });

    const readSub = ws.subscribe(`/topic/chat/room/${roomId}/read`, (event) => {
      if (event.userId !== user?.id) {
        setOtherReadAt(new Date(event.readAt));
      }
    });

    return () => {
      unsubscribe(id);
      if (readSub) readSub.unsubscribe();
    };
  }, [roomId, ws.connected, subscribe, unsubscribe, markAsRead, ws, user?.id]);

  // showTime + unreadCount 계산
  const messagesWithMeta = useMemo(() => {
    return messages.map((msg, idx) => {
      const isMine = msg.senderId === user?.id;
      const minuteKey = formatMinuteKey(msg.createdAt);
      const senderKey = `${msg.senderId}-${minuteKey}`;

      // 같은 발신자 + 같은 분의 마지막 메시지만 시간 표시
      const next = messages[idx + 1];
      const nextSenderKey = next ? `${next.senderId}-${formatMinuteKey(next.createdAt)}` : null;
      const showTime = senderKey !== nextSenderKey;

      // 안읽은 수: 내 메시지이고 상대가 아직 안 읽은 경우 1
      let unreadCount = 0;
      if (isMine) {
        const msgTime = new Date(msg.createdAt);
        if (!otherReadAt || msgTime > otherReadAt) {
          unreadCount = 1;
        }
      }

      return { msg, isMine, showTime, unreadCount };
    });
  }, [messages, user?.id, otherReadAt]);

  const handleSend = (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    sendMessage(Number(roomId), content);
    setInput("");
    inputRef.current?.focus();
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const res = await axios.post("/api/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      const mediaUrl = res.headers["location"];
      if (mediaUrl) {
        sendMessage(Number(roomId), file.type.startsWith("video") ? "동영상" : "사진", mediaUrl);
      }
    } catch (err) {
      console.error("파일 업로드 실패:", err);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div id="chat-room" className="default-root-value">
      <Helmet>
        <title>
          {roomInfo ? `${roomInfo.otherUserNickname}님과의 채팅` : "채팅"} | 하이틴데이
        </title>
      </Helmet>

      <div className="chat-room-header">
        <button className="chat-back-btn" onClick={() => navigate("/chat")}>
          <ArrowLeft size={22} />
        </button>
        <span className="chat-room-header-name">
          {roomInfo?.otherUserNickname || "채팅"}
        </span>
      </div>

      <div className="chat-messages-area">
        {messagesWithMeta.map(({ msg, isMine, showTime, unreadCount }) => (
          <ChatMessage
            key={msg.messageId}
            message={msg}
            isMine={isMine}
            showTime={showTime}
            unreadCount={unreadCount}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          type="file"
          ref={fileInputRef}
          className="chat-file-input"
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        <button
          type="button"
          className="chat-attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <ImagePlus size={22} />
        </button>
        <input
          ref={inputRef}
          type="text"
          className="chat-input"
          placeholder={uploading ? "업로드 중..." : "메시지를 입력하세요"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          disabled={uploading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim() || uploading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
