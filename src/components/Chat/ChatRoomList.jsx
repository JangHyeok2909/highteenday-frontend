import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { MessageSquarePlus } from "lucide-react";
import Header from "components/Header/MainHader/Header";
import { useChat } from "../../contexts/ChatContext";
import { formatRelativeTime } from "../../utils/dateFormat";
import GroupAvatar from "./GroupAvatar";
import CreateGroupModal from "./CreateGroupModal";
import "../Default.css";
import "./ChatRoomList.css";

const ChatRoomList = () => {
  const navigate = useNavigate();
  const { chatRooms, fetchChatRooms } = useChat();
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  const handleCreated = (room) => {
    setShowCreate(false);
    if (room?.roomId) navigate(`/chat/${room.roomId}`);
  };

  return (
    <div id="chat-room-list" className="default-root-value">
      <Helmet><title>채팅 | 하이틴데이</title></Helmet>

      <div className="header">
        <Header isMainPage={false} />
      </div>

      <div className="chat-container">
        <div className="chat-title-row">
          <h2 className="chat-title">채팅</h2>
          <button
            type="button"
            className="chat-create-btn"
            onClick={() => setShowCreate(true)}
            aria-label="단체 채팅방 만들기"
          >
            <MessageSquarePlus size={20} />
          </button>
        </div>

        {chatRooms.length > 0 ? (
          <ul className="chat-list">
            {chatRooms.map((room) => {
              const isGroup = room.category && room.category !== "PRIVATE";
              return (
                <li
                  key={room.roomId}
                  className="chat-room-card"
                  onClick={() => navigate(`/chat/${room.roomId}`)}
                >
                  <div className="chat-room-avatar">
                    <GroupAvatar members={room.members || []} size={48} />
                  </div>

                  <div className="chat-room-info">
                    <div className="chat-room-top">
                      <span className="chat-room-name">
                        {room.roomName}
                        {isGroup && room.memberCount > 0 && (
                          <span className="chat-room-member-count">{room.memberCount}</span>
                        )}
                      </span>
                      {room.lastMessageAt && (
                        <span className="chat-room-time">
                          {formatRelativeTime(room.lastMessageAt)}
                        </span>
                      )}
                    </div>
                    <div className="chat-room-bottom">
                      <span className="chat-room-last-msg">
                        {room.lastMessage || "채팅을 시작해보세요"}
                      </span>
                      {room.unreadCount > 0 && (
                        <span className="chat-room-badge">{room.unreadCount}</span>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="chat-empty">
            <p>채팅방이 없습니다</p>
            <p className="chat-empty-sub">친구 목록에서 채팅을 시작해보세요</p>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
};

export default ChatRoomList;
