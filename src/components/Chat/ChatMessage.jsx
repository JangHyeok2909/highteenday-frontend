import React from "react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./ChatMessage.css";

const ChatMessage = ({ message, isMine, showTime, unreadCount }) => {
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
          <img
            src={message.senderProfileUrl || defaultProfile}
            alt="프로필"
            onError={(e) => { e.target.src = defaultProfile; }}
          />
        </div>
      )}

      <div className="chat-msg-body">
        {!isMine && (
          <span className="chat-msg-sender">{message.senderNickname}</span>
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
