import React from "react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./ChatMessage.css";

const ChatMessage = ({ message, isMine, showTime, showSender, unreadCount, onAvatarClick }) => {
  // 입퇴장/방 이름 변경 같은 안내는 말풍선이 아니라 가운데 한 줄로 보여준다.
  if (message.type === "SYSTEM") {
    return (
      <div className="chat-msg-system">
        <span>{message.content}</span>
      </div>
    );
  }

  const time = new Date(message.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isVideo = message.imageUrl && (
    message.imageUrl.match(/\.(mp4|webm|mov)(\?|$)/i) || message.content === "동영상"
  );

  return (
    <div className={`chat-msg ${isMine ? "mine" : "theirs"}`}>
      {!isMine && (
        <div className="chat-msg-avatar">
          {showSender ? (
            <button
              type="button"
              className="chat-msg-avatar-btn"
              onClick={() => onAvatarClick?.(message.senderId)}
              aria-label={`${message.senderNickname} 프로필 보기`}
            >
              <img
                src={message.senderProfileUrl || defaultProfile}
                alt="프로필"
                onError={(e) => { e.target.src = defaultProfile; }}
              />
            </button>
          ) : (
            <div className="chat-msg-avatar-spacer" />
          )}
        </div>
      )}

      <div className="chat-msg-body">
        {!isMine && showSender && (
          <button
            type="button"
            className="chat-msg-sender"
            onClick={() => onAvatarClick?.(message.senderId)}
          >
            {message.senderNickname}
          </button>
        )}
        <div className="chat-msg-content-row">
          {isMine && (
            <div className="chat-msg-meta">
              {unreadCount > 0 && (
                <span className="chat-msg-unread">{unreadCount}</span>
              )}
              {showTime && <span className="chat-msg-time">{time}</span>}
            </div>
          )}
          <div className="chat-msg-bubble">
            {message.content && message.content !== "사진" && message.content !== "동영상" && (
              <span>{message.content}</span>
            )}
            {message.imageUrl && (
              isVideo ? (
                <video
                  className="chat-msg-video"
                  src={message.imageUrl}
                  controls
                  preload="metadata"
                />
              ) : (
                <img
                  className="chat-msg-image"
                  src={message.imageUrl}
                  alt="첨부 이미지"
                  onClick={() => window.open(message.imageUrl, "_blank")}
                />
              )
            )}
          </div>
          {!isMine && (
            <div className="chat-msg-meta">
              {unreadCount > 0 && (
                <span className="chat-msg-unread">{unreadCount}</span>
              )}
              {showTime && <span className="chat-msg-time">{time}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
