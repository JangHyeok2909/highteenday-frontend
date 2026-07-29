import React, { useState } from "react";
import { X, UserPlus, LogOut, Crown, Shield } from "lucide-react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./ChatMemberList.css";

const roleBadge = (role) => {
  if (role === "OWNER") return <span className="cml-role owner"><Crown size={12} /> 방장</span>;
  if (role === "ADMIN") return <span className="cml-role admin"><Shield size={12} /> 관리자</span>;
  return null;
};

/**
 * 단체방 사이드 패널. 멤버 목록과 초대/강퇴/나가기를 담당한다.
 * canManage 는 내가 OWNER 또는 ADMIN 인지 여부다.
 */
const ChatMemberList = ({
  members,
  myUserId,
  canManage,
  onClose,
  onInvite,
  onKick,
  onLeave,
}) => {
  const [busyId, setBusyId] = useState(null);

  const handleKick = async (member) => {
    if (!window.confirm(`${member.nickname}님을 내보낼까요?`)) return;
    setBusyId(member.userId);
    try {
      await onKick(member.userId);
    } finally {
      setBusyId(null);
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("채팅방을 나가시겠습니까?")) return;
    await onLeave();
  };

  return (
    <div className="cml-backdrop" onClick={onClose}>
      <aside className="cml-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cml-header">
          <h3>대화 상대 {members.length}</h3>
          <button type="button" className="cml-close" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        {canManage && (
          <button type="button" className="cml-invite" onClick={onInvite}>
            <UserPlus size={16} /> 친구 초대
          </button>
        )}

        <ul className="cml-list">
          {members.map((m) => (
            <li key={m.userId} className="cml-item">
              <img
                src={m.profileUrl || defaultProfile}
                alt={`${m.nickname} 프로필`}
                onError={(e) => { e.target.src = defaultProfile; }}
              />
              <div className="cml-info">
                <span className="cml-name">
                  {m.nickname}
                  {m.userId === myUserId && <span className="cml-me">나</span>}
                </span>
                {roleBadge(m.role)}
              </div>
              {canManage && m.userId !== myUserId && m.role !== "OWNER" && (
                <button
                  type="button"
                  className="cml-kick"
                  onClick={() => handleKick(m)}
                  disabled={busyId === m.userId}
                >
                  내보내기
                </button>
              )}
            </li>
          ))}
        </ul>

        <button type="button" className="cml-leave" onClick={handleLeave}>
          <LogOut size={16} /> 채팅방 나가기
        </button>
      </aside>
    </div>
  );
};

export default ChatMemberList;
