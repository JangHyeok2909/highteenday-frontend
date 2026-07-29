import React, { useEffect, useMemo, useState } from "react";
import { X, Search, Check } from "lucide-react";
import axios from "axios";
import defaultProfile from "../../assets/default_profile_image.jpg";
import "./CreateGroupModal.css";

/**
 * 이미 방에 있는 사람은 목록에서 빼고 보여준다.
 * 스타일은 CreateGroupModal 과 공유한다.
 */
const InviteMembersModal = ({ existingMemberIds = [], onClose, onSubmit }) => {
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/friends/list", { withCredentials: true });
        const list = Array.isArray(res.data) ? res.data : [];
        setFriends(list.filter((f) => !f.isBlocked && !existingMemberIds.includes(f.id)));
      } catch {
        setFriends([]);
      }
    };
    load();
    // existingMemberIds 는 렌더마다 새 배열이라 길이로만 의존성을 건다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingMemberIds.length]);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return friends;
    return friends.filter((f) =>
      `${f.name ?? ""}${f.nickname ?? ""}`.toLowerCase().includes(k)
    );
  }, [friends, keyword]);

  const toggle = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) return;

    setSubmitting(true);
    setError("");
    try {
      await onSubmit(selected);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "초대에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cgm-backdrop" onClick={onClose}>
      <div className="cgm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cgm-header">
          <h3>친구 초대</h3>
          <button type="button" className="cgm-close" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="cgm-search">
            <Search size={16} />
            <input
              type="text"
              placeholder="친구 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <div className="cgm-selected-count">
            {selected.length > 0 ? `${selected.length}명 선택됨` : "초대할 친구를 선택하세요"}
          </div>

          <ul className="cgm-friend-list">
            {filtered.length === 0 && (
              <li className="cgm-empty">초대할 수 있는 친구가 없습니다</li>
            )}
            {filtered.map((f) => {
              const isSelected = selected.includes(f.id);
              return (
                <li
                  key={f.id}
                  className={`cgm-friend${isSelected ? " selected" : ""}`}
                  onClick={() => toggle(f.id)}
                >
                  <img
                    src={f.profileUrl || defaultProfile}
                    alt={`${f.name ?? "사용자"} 프로필`}
                    onError={(e) => { e.target.src = defaultProfile; }}
                  />
                  <div className="cgm-friend-info">
                    <span className="cgm-friend-name">{f.name || f.nickname}</span>
                    {f.school && (
                      <span className="cgm-friend-sub">{f.school} {f.grade}</span>
                    )}
                  </div>
                  <span className={`cgm-check${isSelected ? " on" : ""}`}>
                    {isSelected && <Check size={14} />}
                  </span>
                </li>
              );
            })}
          </ul>

          {error && <p className="cgm-error">{error}</p>}

          <button
            type="submit"
            className="cgm-submit"
            disabled={submitting || selected.length === 0}
          >
            {submitting ? "초대 중..." : `${selected.length}명 초대하기`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteMembersModal;
