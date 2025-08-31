import React, { useState, useEffect, useMemo, useRef } from "react";
// import axios from "axios";
import "./FriendList.css";
import FriendAdd from "./FriendAdd";
import AcceptFriend from "./AcceptFriend";

const MOCK_FRIENDS = [
  { id: 1, name: "박박", school: "충렬초등학교", grade: "3학년", profileImageUrl: "", isBlocked: false },
  { id: 2, name: "김첨지", school: "브니엘고등학교", grade: "3학년", profileImageUrl: "", isBlocked: false },
  { id: 3, name: "김땅땅", school: "경성고등학교", grade: "3학년", profileImageUrl: "", isBlocked: false },
  { id: 4, name: "김하늘", school: "경성고등학교", grade: "2학년", profileImageUrl: "", isBlocked: false },
];

const getInitials = (name = "") => {
  const t = name.trim();
  if (!t) return "??";
  const parts = t.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return [...t].slice(0, 2).join("").toUpperCase();
};

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [showFriendAdd, setShowFriendAdd] = useState(false);
  const [showAcceptFriend, setShowAcceptFriend] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    /* 실제 API 사용 시 주석 해제
    const fetchFriends = async () => {
      try {
        const res = await axios.get("/api/friends/list", { withCredentials: true });
        setFriends(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
        setFriends([]);
      }
    };
    fetchFriends();
    */

    setFriends(MOCK_FRIENDS); // 더미로 테스트
  }, []);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target)) setOpenMenuId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return alert("검색어를 입력해주세요");
  };

  const filtered = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return friends;
    return friends.filter((f) =>
      [f.name ?? "", f.school ?? "", f.grade ?? ""].join(" ").toLowerCase().includes(kw)
    );
  }, [friends, searchTerm]);

  const toggleMenu = (id) => setOpenMenuId((prev) => (prev === id ? null : id));

  const blockFriend = async (friendId) => {
    try {
      // 실제 차단 API
      // await axios.post("/api/friends/block", { friendId }, { withCredentials: true });

      setFriends((prev) =>
        prev.map((f) => (f.id === friendId ? { ...f, isBlocked: true } : f))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error("차단 실패:", err);
      alert("차단에 실패했습니다.");
    }
  };

  const unblockFriend = async (friendId) => {
    try {
      // 실제 차단 해제 API
      // await axios.post("/api/friends/unblock", { friendId }, { withCredentials: true });

      setFriends((prev) =>
        prev.map((f) => (f.id === friendId ? { ...f, isBlocked: false } : f))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error("차단 해제 실패:", err);
      alert("차단 해제에 실패했습니다.");
    }
  };

  const deleteFriend = async (friendId) => {
    try {
      // 친구 삭제 
      // await axios.post("/api/friends/delete", { friendId }, { withCredentials: true });

      setFriends((prev) => prev.filter((f) => f.id !== friendId));
      setOpenMenuId(null);
    } catch (err) {
      console.error("친구 삭제 실패:", err);
      alert("친구 삭제에 실패했습니다.");
    }
  };

  return (
    <div id="friend-list">
      <div className="friend-container">
        <div className="toolbar">
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="친구 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="친구 검색 입력"
            />
            <button type="submit" aria-label="검색">🔍</button>
          </form>

          <div className="action-buttons">
            <button type="button" onClick={() => setShowFriendAdd(true)}>친구 추가</button>
            <button type="button" onClick={() => setShowAcceptFriend(true)}>친구 요청 목록</button>
          </div>
        </div>

        <ul className="friend-list">
          {filtered.length > 0 ? (
            filtered.map((friend) => {
              const initials = getInitials(friend.name || friend.nickname);
              const isOpen = openMenuId === friend.id;
              return (
                <li key={friend.id} className="friend-card">
                  <div className="friend-info">
                    <div className="friend-avatar">
                      {/* 프로필 사진 URL */}
                      {friend.profileImageUrl ? (
                        <img
                          src={friend.profileImageUrl}
                          alt={`${friend.name ?? "사용자"} 프로필`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            const sib = e.currentTarget.nextElementSibling;
                            if (sib) sib.classList.add("show");
                          }}
                        />
                      ) : null}
                      <span className="avatar-initials">{initials}</span>
                    </div>

                    <div className="friend-text">
                      <span className={`friend-name${friend.isBlocked ? " blocked" : ""}`}>
                        {friend.name}
                      </span>
                      <span className="friend-sub">
                        {friend.school} {friend.grade}
                      </span>
                    </div>
                  </div>

                  <div className="friend-actions">
                    <button title="채팅" aria-label="채팅">💬</button>
                    <button title="일정" aria-label="일정">📅</button>

                    <div className="more-wrap" ref={menuRef}>
                      <button
                        type="button"
                        className="more-btn"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(friend.id);
                        }}
                        title="더보기"
                      >
                        ⋮
                      </button>

                      {isOpen && (
                        <div className="more-menu" role="menu">
                          {friend.isBlocked ? (
                            <button
                              type="button"
                              role="menuitem"
                              className="more-item"
                              onClick={() => unblockFriend(friend.id)}
                            >
                              차단 해제
                            </button>
                          ) : (
                            <button
                              type="button"
                              role="menuitem"
                              className="more-item danger"
                              onClick={() => blockFriend(friend.id)}
                            >
                              차단
                            </button>
                          )}

                          <button
                            type="button"
                            role="menuitem"
                            className="more-item"
                            onClick={() => deleteFriend(friend.id)}
                          >
                            친구 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <li className="friend-empty">검색중 ...</li>
          )}
        </ul>

        {showFriendAdd && (
          <div className="modal-overlay" onClick={() => setShowFriendAdd(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <FriendAdd onClose={() => setShowFriendAdd(false)} />
            </div>
          </div>
        )}
        {showAcceptFriend && (
          <div className="modal-overlay" onClick={() => setShowAcceptFriend(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <AcceptFriend onClose={() => setShowAcceptFriend(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
