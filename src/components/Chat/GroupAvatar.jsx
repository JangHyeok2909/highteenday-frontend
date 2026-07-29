import React from "react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./GroupAvatar.css";

/**
 * 1:1 방은 상대 프로필 하나, 단체방은 최대 4명을 격자로 겹쳐 보여준다.
 * members 는 나를 제외한 참여자 목록(ChatMemberDto)이다.
 */
const GroupAvatar = ({ members = [], size = 48 }) => {
  const shown = members.slice(0, 4);
  const isGrid = shown.length > 1;

  if (shown.length === 0) {
    return (
      <div className="group-avatar single" style={{ width: size, height: size }}>
        <img src={defaultProfile} alt="프로필" />
      </div>
    );
  }

  return (
    <div
      className={`group-avatar ${isGrid ? "grid" : "single"}`}
      style={{ width: size, height: size }}
    >
      {shown.map((m) => (
        <img
          key={m.userId}
          src={m.profileUrl || defaultProfile}
          alt={`${m.nickname} 프로필`}
          onError={(e) => { e.target.src = defaultProfile; }}
        />
      ))}
    </div>
  );
};

export default GroupAvatar;
