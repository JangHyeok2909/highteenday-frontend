import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Header from "components/Header/MainHader/Header";
import { useChat } from "../../contexts/ChatContext";
import defaultProfile from "../../assets/default_profile_image.jpg";
import { formatRelativeTime } from "../../utils/dateFormat";
import "../Default.css";
import "./ChatRoomList.css";

const ChatRoomList = () => {
  const navigate = useNavigate();
  const { chatRooms, fetchChatRooms } = useChat();

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  return (
    <div id="chat-room-list" className="default-root-value">
      <Helmet><title>채팅 | 하이틴데이</title></Helmet>

      <div className="header">
        <Header isMainPage={false} />
      </div>

      <div className="chat-container">
        <h2 className="chat-title">채팅</h2>

        {chatRooms.length > 0 ? (
          <ul className="chat-list">
            {chatRooms.map((room) => (
              <li
                key={room.roomId}
                className="chat-room-card"
                onClick={() => navigate(`/chat/${room.roomId}`)}
              >
                <div className="chat-room-avatar">
                  <img
                    src={room.otherUserProfileUrl || defaultProfile}
                    alt={`${room.otherUserNickname} 프로필`}
                    onError={(e) => { e.target.src = defaultProfile; }}
                  />
                </div>

                <div className="chat-room-info">
                  <div className="chat-room-top">
                    <span className="chat-room-name">{room.otherUserNickname}</span>
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
            ))}
          </ul>
        ) : (
          <div className="chat-empty">
            <p>채팅방이 없습니다</p>
            <p className="chat-empty-sub">친구 목록에서 채팅을 시작해보세요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomList;
