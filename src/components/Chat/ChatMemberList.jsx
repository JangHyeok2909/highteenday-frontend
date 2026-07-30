import React, { useState } from "react";
import { X, UserPlus, LogOut, Crown, Shield, UserCheck, Clock } from "lucide-react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import { RELATION, sendFriendRequest } from "../../utils/friendApi";
import "./ChatMemberList.css";

const roleBadge = (role) => {
  if (role === "OWNER") return <span className="cml-role owner"><Crown size={12} /> 방장</span>;
  if (role === "ADMIN") return <span className="cml-role admin"><Shield size={12} /> 관리자</span>;
  return null;
};

/**
 * 단체방 사이드 패널. 멤버 목록과 초대/강퇴/나가기를 담당한다.
 * canManage 는 내가 OWNER 또는 ADMIN 인지 여부다.
 *
 * 멤버마다 나와의 관계(relation)가 함께 내려오므로, 친구 여부를 목록에서 바로 보여주고
 * 아직 친구가 아닌 사람에게는 그 자리에서 요청을 보낼 수 있다.
 */
const ChatMemberList = ({
  members,
  myUserId,
  canManage,
  onClose,
  onInvite,
  onKick,
  onLeave,
  onSelectMember,
  onRelationChange,
}) => {
  const [busyId, setBusyId] = useState(null);
  const [requestError, setRequestError] = useState("");

  const handleAddFriend = async (member) => {
    setBusyId(member.userId);
    setRequestError("");
    try {
      await sendFriendRequest(member.userId);
      onRelationChange?.(member.userId, RELATION.REQUEST_SENT);
    } catch (err) {
      setRequestError(err?.response?.data?.message || "친구 요청에 실패했습니다.");
    } finally {
      setBusyId(null);
    }
  };

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

        {requestError && <p className="cml-error">{requestError}</p>}

        <ul className="cml-list">
          {members.map((m) => {
            const isMe = m.userId === myUserId;
            return (
              <li key={m.userId} className="cml-item">
                <button
                  type="button"
                  className="cml-profile-btn"
                  onClick={() => !isMe && onSelectMember?.(m)}
                  disabled={isMe}
                  aria-label={`${m.nickname} 프로필 보기`}
                >
                  <img
                    src={m.profileUrl || defaultProfile}
                    alt={`${m.nickname} 프로필`}
                    onError={(e) => { e.target.src = defaultProfile; }}
                  />
                  <div className="cml-info">
                    <span className="cml-name">
                      {m.nickname}
                      {isMe && <span className="cml-me">나</span>}
                    </span>
                    <span className="cml-badges">
                      {roleBadge(m.role)}
                      {!isMe && m.relation === RELATION.FRIEND && (
                        <span className="cml-relation friend"><UserCheck size={12} /> 친구</span>
                      )}
                      {!isMe && m.relation === RELATION.REQUEST_SENT && (
                        <span className="cml-relation pending"><Clock size={12} /> 요청함</span>
                      )}
                      {!isMe && m.relation === RELATION.REQUEST_RECEIVED && (
                        <span className="cml-relation pending"><Clock size={12} /> 요청받음</span>
                      )}
                    </span>
                  </div>
                </button>

                {!isMe && m.relation === RELATION.NONE && (
                  <button
                    type="button"
                    className="cml-add"
                    onClick={() => handleAddFriend(m)}
                    disabled={busyId === m.userId}
                  >
                    <UserPlus size={14} /> 친구 추가
                  </button>
                )}

                {canManage && !isMe && m.role !== "OWNER" && (
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
            );
          })}
        </ul>

        <button type="button" className="cml-leave" onClick={handleLeave}>
          <LogOut size={16} /> 채팅방 나가기
        </button>
      </aside>
    </div>
  );
};

export default ChatMemberList;
