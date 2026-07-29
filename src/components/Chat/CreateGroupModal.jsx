import React, { useCallback, useEffect, useMemo, useState } from "react";
import { X, Search, Check } from "lucide-react";
import axios from "axios";
import defaultProfile from "../../assets/default_profile_image.jpg";
import { useChat } from "../../contexts/ChatContext";
import "./CreateGroupModal.css";

const MAX_MEMBERS = 100;

const CreateGroupModal = ({ onClose, onCreated }) => {
  const { createGroupRoom } = useChat();

  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get("/api/friends/list", { withCredentials: true });
        const list = Array.isArray(res.data) ? res.data : [];
        // 차단한 친구는 초대 대상에서 제외한다.
        setFriends(list.filter((f) => !f.isBlocked));
      } catch {
        setFriends([]);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const k = keyword.trim().toLowerCase();
    if (!k) return friends;
    return friends.filter((f) =>
      `${f.name ?? ""}${f.nickname ?? ""}`.toLowerCase().includes(k)
    );
  }, [friends, keyword]);

  const toggle = useCallback((id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("초대할 친구를 1명 이상 선택해주세요.");
      return;
    }
    if (selected.length + 1 > MAX_MEMBERS) {
      setError(`채팅방 정원은 ${MAX_MEMBERS}명입니다.`);
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const room = await createGroupRoom(roomName.trim(), selected);
      onCreated?.(room);
    } catch (err) {
      setError(err?.response?.data?.message || "채팅방 생성에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cgm-backdrop" onClick={onClose}>
      <div className="cgm-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cgm-header">
          <h3>단체 채팅방 만들기</h3>
          <button type="button" className="cgm-close" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="cgm-name-input"
            placeholder="채팅방 이름 (비워두면 참여자 이름으로 지정됩니다)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength={30}
          />

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
            {selected.length > 0
              ? `${selected.length}명 선택됨`
              : "초대할 친구를 선택하세요"}
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
            {submitting ? "만드는 중..." : `${selected.length + 1}명으로 채팅방 만들기`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
