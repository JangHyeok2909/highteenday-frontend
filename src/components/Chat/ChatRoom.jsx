import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Send, ImagePlus, Users } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";
import { useChat } from "../../contexts/ChatContext";
import { useWebSocket } from "../../contexts/WebSocketContext";
import ChatMessage from "./ChatMessage";
import ChatMemberList from "./ChatMemberList";
import InviteMembersModal from "./InviteMembersModal";
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
  const {
    subscribe, unsubscribe, sendMessage, markAsRead, setActiveRoom,
    fetchMembers, inviteMembers, leaveRoom, kickMember, fetchChatRooms,
  } = useChat();
  const ws = useWebSocket();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomInfo, setRoomInfo] = useState(null);
  // 참여자별 읽음 위치. 메시지별 미읽음 수를 여기서 직접 계산한다.
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sendError, setSendError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const numericRoomId = Number(roomId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const reloadMembers = useCallback(async () => {
    try {
      setMembers(await fetchMembers(numericRoomId));
    } catch {
      // ignore
    }
  }, [fetchMembers, numericRoomId]);

  // 서버는 메시지를 저장할 때 발신자의 읽음 위치를 그 메시지까지 함께 전진시킨다.
  // 그런데 그 전진은 /read 이벤트로 방송되지 않는다(markAsRead는 위치가 실제로
  // 움직였을 때만 방송하는데, 발신자는 이미 전진해 있어 움직이지 않는다).
  // 그래서 클라이언트도 같은 규칙을 직접 반영해줘야 발신자가 자기 메시지의
  // 미읽음 인원에 잡히지 않는다. 위치는 뒤로 가지 않는다.
  const advanceReadPosition = useCallback((userId, msgId) => {
    if (userId == null || msgId == null) return;
    setMembers((prev) =>
      prev.map((m) =>
        m.userId === userId && (m.lastReadMsgId ?? 0) < msgId
          ? { ...m, lastReadMsgId: msgId }
          : m
      )
    );
  }, []);

  // 히스토리 + 방 정보 + 참여자 읽음 위치
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(`/api/chat/rooms/${roomId}/messages`, {
          withCredentials: true,
        });
        setMessages(data);
        const lastId = data.length > 0 ? data[data.length - 1].messageId : null;
        markAsRead(numericRoomId, lastId);
      } catch (err) {
        console.error("메시지 로드 실패:", err);
      }
    };

    const fetchRoomInfo = async () => {
      try {
        const { data } = await axios.get(`/api/chat/rooms/${roomId}`, {
          withCredentials: true,
        });
        setRoomInfo(data);
      } catch {
        // ignore
      }
    };

    fetchMessages();
    fetchRoomInfo();
    reloadMembers();
    setActiveRoom(numericRoomId);

    return () => setActiveRoom(null);
  }, [roomId, numericRoomId, markAsRead, setActiveRoom, reloadMembers]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // 재연결되면 실패 안내를 지운다.
  useEffect(() => {
    if (ws.connected) setSendError("");
  }, [ws.connected]);

  // STOMP 구독: 메시지 / 읽음 / 멤버 변경
  useEffect(() => {
    if (!ws.connected) return;

    subscribe(numericRoomId, (msg) => {
      setMessages((prev) => {
        // 재전송 등으로 같은 메시지가 두 번 들어오면 무시한다.
        if (prev.some((m) => m.messageId === msg.messageId)) return prev;
        return [...prev, msg];
      });
      // SYSTEM 메시지는 서버가 발신자 위치를 전진시키지 않으므로 제외한다.
      if (msg.type !== "SYSTEM") advanceReadPosition(msg.senderId, msg.messageId);
      markAsRead(numericRoomId, msg.messageId);
    });

    const readSub = ws.subscribe(`/topic/chat/room/${roomId}/read`, (event) => {
      // 누군가의 읽음 위치가 전진하면 그 사람의 위치만 갱신한다.
      setMembers((prev) =>
        prev.map((m) =>
          m.userId === event.userId ? { ...m, lastReadMsgId: event.lastReadMsgId } : m
        )
      );
    });

    const memberSub = ws.subscribe(`/topic/chat/room/${roomId}/members`, (event) => {
      reloadMembers();
      if (event.eventType === "ROOM_RENAMED" && event.roomName) {
        setRoomInfo((prev) => (prev ? { ...prev, roomName: event.roomName } : prev));
      }
      if (event.memberCount != null) {
        setRoomInfo((prev) => (prev ? { ...prev, memberCount: event.memberCount } : prev));
      }
    });

    return () => {
      // 이미 끊긴 연결에서 unsubscribe는 예외를 던진다(stompjs _checkConnection).
      // 정리 도중 예외가 나면 뒤쪽 구독이 해제되지 않으므로 각각 감싼다.
      unsubscribe(numericRoomId);
      [readSub, memberSub].forEach((sub) => {
        if (!sub) return;
        try { sub.unsubscribe(); } catch { /* 연결이 이미 끊김 */ }
      });
    };
  }, [roomId, numericRoomId, ws.connected, subscribe, unsubscribe, markAsRead, ws,
      reloadMembers, advanceReadPosition]);

  // 메시지별 메타. 미읽음 수는 서버와 같은 규칙으로 계산한다:
  // "읽음 위치(lastReadMsgId)가 이 메시지 ID보다 작은 참여자 수".
  // 발신자는 전송 시점에 위치가 전진하므로 자동으로 빠진다.
  const messagesWithMeta = useMemo(() => {
    const readPositions = members.map((m) => m.lastReadMsgId ?? 0);

    return messages.map((msg, idx) => {
      const isMine = msg.senderId === user?.id;
      const minuteKey = formatMinuteKey(msg.createdAt);
      const senderKey = `${msg.senderId}-${minuteKey}`;

      const next = messages[idx + 1];
      const nextSenderKey =
        next && next.type !== "SYSTEM"
          ? `${next.senderId}-${formatMinuteKey(next.createdAt)}`
          : null;
      const showTime = senderKey !== nextSenderKey;

      // 단체방에서 연속 발언은 첫 줄에만 프로필/닉네임을 보여준다.
      const prev = messages[idx - 1];
      const showSender = !prev || prev.type === "SYSTEM" || prev.senderId !== msg.senderId;

      const unreadCount =
        msg.type === "SYSTEM"
          ? 0
          : readPositions.filter((pos) => pos < msg.messageId).length;

      return { msg, isMine, showTime, showSender, unreadCount };
    });
  }, [messages, user?.id, members]);

  const isGroup = roomInfo?.category && roomInfo.category !== "PRIVATE";
  const canManage = roomInfo?.myRole === "OWNER" || roomInfo?.myRole === "ADMIN";

  const handleSend = (e) => {
    e.preventDefault();
    const content = input.trim();
    if (!content) return;

    // 전송에 실패하면 입력값을 지우지 않는다. 지워버리면 사용자가 쓴 글이
    // 아무 안내도 없이 사라진다.
    if (!sendMessage(numericRoomId, content)) {
      setSendError("연결이 끊겨 전송하지 못했습니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSendError("");
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
        sendMessage(numericRoomId, file.type.startsWith("video") ? "동영상" : "사진", mediaUrl);
      }
    } catch (err) {
      console.error("파일 업로드 실패:", err);
      alert("파일 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleInvite = async (memberIds) => {
    await inviteMembers(numericRoomId, memberIds);
    await reloadMembers();
  };

  const handleKick = async (userId) => {
    try {
      await kickMember(numericRoomId, userId);
      await reloadMembers();
    } catch (err) {
      alert(err?.response?.data?.message || "내보내기에 실패했습니다.");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveRoom(numericRoomId);
      await fetchChatRooms();
      navigate("/chat");
    } catch (err) {
      alert(err?.response?.data?.message || "나가기에 실패했습니다.");
    }
  };

  const title = roomInfo?.roomName || "채팅";

  return (
    <div id="chat-room" className="default-root-value">
      <Helmet>
        <title>{roomInfo ? `${title} | 하이틴데이` : "채팅 | 하이틴데이"}</title>
      </Helmet>

      <div className="chat-room-header">
        <button className="chat-back-btn" onClick={() => navigate("/chat")}>
          <ArrowLeft size={22} />
        </button>
        <span className="chat-room-header-name">
          {title}
          {isGroup && roomInfo?.memberCount > 0 && (
            <span className="chat-room-header-count">{roomInfo.memberCount}</span>
          )}
        </span>
        {isGroup && (
          <button
            className="chat-members-btn"
            onClick={() => setShowMembers(true)}
            aria-label="대화 상대 보기"
          >
            <Users size={20} />
          </button>
        )}
      </div>

      <div className="chat-messages-area">
        {messagesWithMeta.map(({ msg, isMine, showTime, showSender, unreadCount }) => (
          <ChatMessage
            key={msg.messageId}
            message={msg}
            isMine={isMine}
            showTime={showTime}
            showSender={showSender}
            unreadCount={unreadCount}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {(!ws.connected || sendError) && (
        <div className="chat-connection-notice">
          {sendError || "연결 중입니다..."}
        </div>
      )}

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
          placeholder={
            uploading ? "업로드 중..." : !ws.connected ? "연결 중..." : "메시지를 입력하세요"
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          autoComplete="off"
          disabled={uploading}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim() || uploading || !ws.connected}
        >
          <Send size={20} />
        </button>
      </form>

      {showMembers && (
        <ChatMemberList
          members={members}
          myUserId={user?.id}
          canManage={canManage}
          onClose={() => setShowMembers(false)}
          onInvite={() => { setShowMembers(false); setShowInvite(true); }}
          onKick={handleKick}
          onLeave={handleLeave}
        />
      )}

      {showInvite && (
        <InviteMembersModal
          existingMemberIds={members.map((m) => m.userId)}
          onClose={() => setShowInvite(false)}
          onSubmit={handleInvite}
        />
      )}
    </div>
  );
};

export default ChatRoom;
