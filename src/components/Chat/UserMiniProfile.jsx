import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, MessageCircle, CalendarDays, UserPlus, UserCheck, Clock } from "lucide-react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import { RELATION, isFriend, sendFriendRequest, cancelFriendRequest } from "../../utils/friendApi";
import "./UserMiniProfile.css";

/**
 * 채팅에서 아바타나 참여자를 눌렀을 때 뜨는 카드.
 *
 * 여기서 보여주는 닉네임·프로필 이미지는 이미 채팅 화면에 떠 있는 정보라 새로 여는 게 없다.
 * 학교나 학년 같은 실제 프로필 정보는 친구 전용 페이지(/user/:userId)에만 있다.
 *
 * member 는 ChatMemberDto 또는 그와 같은 모양({ userId, nickname, profileUrl, relation }).
 */
const UserMiniProfile = ({ member, onClose, onStartChat, onOpenTimetable, onRelationChange }) => {
  const navigate = useNavigate();
  const [relation, setRelation] = useState(member.relation ?? RELATION.NONE);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const friend = isFriend(relation);

  const runFriendAction = async (action, nextRelation) => {
    setBusy(true);
    setError("");
    try {
      await action(member.userId);
      setRelation(nextRelation);
      onRelationChange?.(member.userId, nextRelation);
    } catch (err) {
      setError(err?.response?.data?.message || "요청을 처리하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const friendActionButton = () => {
    if (relation === RELATION.SELF) return null;

    if (friend) {
      return (
        <span className="ump-status">
          <UserCheck size={16} /> 친구
        </span>
      );
    }
    if (relation === RELATION.REQUEST_SENT) {
      return (
        <button
          type="button"
          className="ump-action secondary"
          disabled={busy}
          onClick={() => runFriendAction(cancelFriendRequest, RELATION.NONE)}
        >
          <Clock size={16} /> 요청함 · 취소
        </button>
      );
    }
    if (relation === RELATION.REQUEST_RECEIVED) {
      return (
        <button type="button" className="ump-action" onClick={() => navigate("/friend")}>
          <UserCheck size={16} /> 받은 요청 수락하기
        </button>
      );
    }
    return (
      <button
        type="button"
        className="ump-action"
        disabled={busy}
        onClick={() => runFriendAction(sendFriendRequest, RELATION.REQUEST_SENT)}
      >
        <UserPlus size={16} /> 친구 요청
      </button>
    );
  };

  return (
    <div className="ump-backdrop" onClick={onClose}>
      <div className="ump-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ump-close" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        <img
          className="ump-avatar"
          src={member.profileUrl || defaultProfile}
          alt={`${member.nickname} 프로필`}
          onError={(e) => { e.target.src = defaultProfile; }}
        />
        <span className="ump-nickname">{member.nickname}</span>

        {error && <p className="ump-error">{error}</p>}

        <div className="ump-actions">
          {friendActionButton()}

          {/* 개인채팅과 시간표는 친구에게만. 서버도 같은 기준으로 막고 있어서
              여기를 우회해도 각각 400, 404가 난다. */}
          {friend && (
            <>
              <button
                type="button"
                className="ump-action"
                disabled={busy}
                onClick={() => onStartChat(member)}
              >
                <MessageCircle size={16} /> 개인채팅
              </button>
              <button
                type="button"
                className="ump-action"
                onClick={() => onOpenTimetable(member)}
              >
                <CalendarDays size={16} /> 시간표 보기
              </button>
              <button
                type="button"
                className="ump-action secondary"
                onClick={() => navigate(`/user/${member.userId}`)}
              >
                프로필 자세히 보기
              </button>
            </>
          )}

          {!friend && relation !== RELATION.SELF && (
            <p className="ump-hint">친구가 되면 개인채팅과 시간표를 볼 수 있어요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMiniProfile;
