import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, MessageCircle, CalendarDays } from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import { fetchUserProfile } from "../utils/friendApi";
import FriendTimetableModal from "../components/TimetableRelated/FriendTimetableModal";
import defaultProfile from "../assets/default_profile_image.jpg";
import "../components/Default.css";
import "./UserProfilePage.css";

const GRADE_LABELS = { SOPHOMORE: "1학년", JUNIOR: "2학년", SENIOR: "3학년" };

/**
 * 친구 전용 프로필. 친구가 아니면 서버가 404를 주므로 안내 문구로 갈린다.
 *
 * 실명, 이메일, 전화번호, 반은 서버가 애초에 내려주지 않는다. 생일도 월·일까지만 온다.
 */
const UserProfilePage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { startPrivateRoom } = useChat();

  const [profile, setProfile] = useState(null);
  const [notFriend, setNotFriend] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTimetable, setShowTimetable] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFriend(false);
    try {
      setProfile(await fetchUserProfile(userId));
    } catch (err) {
      if (err?.response?.status === 404) setNotFriend(true);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleStartChat = async () => {
    try {
      const room = await startPrivateRoom(profile.userId);
      navigate(`/chat/${room.roomId}`);
    } catch (err) {
      alert(err?.response?.data?.message || "채팅방을 열 수 없습니다.");
    }
  };

  const title = profile ? `${profile.nickname}님의 프로필` : "프로필";

  return (
    <div id="user-profile-page" className="default-root-value">
      <Helmet>
        <title>{`${title} | 하이틴데이`}</title>
      </Helmet>

      <div className="up-header">
        <button className="up-back" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <ArrowLeft size={22} />
        </button>
        <span className="up-header-title">프로필</span>
      </div>

      {loading && <p className="up-message">불러오는 중...</p>}

      {!loading && notFriend && (
        <p className="up-message">
          친구에게만 공개된 프로필입니다.
        </p>
      )}

      {!loading && profile && (
        <>
          <section className="up-card">
            <img
              className="up-avatar"
              src={profile.profileUrl || defaultProfile}
              alt={`${profile.nickname} 프로필`}
              onError={(e) => { e.currentTarget.src = defaultProfile; }}
            />
            <span className="up-nickname">{profile.nickname}</span>

            {(profile.schoolName || profile.grade) && (
              <span className="up-sub">
                {[profile.schoolName, GRADE_LABELS[profile.grade]].filter(Boolean).join(" · ")}
              </span>
            )}

            {profile.birthday && (
              <span className="up-sub">생일 {profile.birthday.replace("-", "월 ")}일</span>
            )}
          </section>

          {profile.relation === "FRIEND" && (
            <div className="up-actions">
              <button type="button" className="up-action" onClick={handleStartChat}>
                <MessageCircle size={16} /> 개인채팅
              </button>
              <button
                type="button"
                className="up-action secondary"
                onClick={() => setShowTimetable(true)}
              >
                <CalendarDays size={16} /> 시간표 보기
              </button>
            </div>
          )}
        </>
      )}

      {showTimetable && profile && (
        <FriendTimetableModal
          friend={{ id: profile.userId, nickname: profile.nickname }}
          onClose={() => setShowTimetable(false)}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
