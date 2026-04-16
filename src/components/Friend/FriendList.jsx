import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { X } from "lucide-react";
import "./FriendList.css";
import "../Default.css";
import FriendAdd from "./FriendAdd";
import AcceptFriend from "./AcceptFriend";
import Header from "components/Header/MainHader/Header";
import axios from "axios";




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

  const fetchFriends = useCallback(async () => {
    try {
      const res = await axios.get("/api/friends/list", { withCredentials: true });
      setFriends(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("친구 목록 불러오기 실패:", err);
      setFriends([]);
    }
  }, []);

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

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

  const blockFriend = async (id, email) => {
    try {
      await axios.post(
        "/api/friends/block",
        { id, email },
        { withCredentials: true }
      );

      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isBlocked: true } : f))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error("차단 실패:", err);
      alert(err?.response?.data?.message || "차단에 실패했습니다.");
    }
  };

  const unblockFriend = async (id, email) => {
    try {
      await axios.post("/api/friends/unblock", { id, email }, { withCredentials: true });

      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isBlocked: false } : f))
      );
      setOpenMenuId(null);
    } catch (err) {
      console.error("차단 해제 실패:", err);
      alert(err?.response?.data?.message || "차단 해제에 실패했습니다.");
    }
  };

  const deleteFriend = async (id, email) => {
    try {
      await axios.delete(
        "/api/friends/delete", {
          data: { id, email }, 
          withCredentials: true,
          headers: { "Content-Type": "application/json" }
        }
      );

      setFriends((prev) => prev.filter((f) => f.id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error("친구 삭제 실패:", err);
      alert(err?.response?.data?.message || "친구 삭제에 실패했습니다.");
    }
  };

  return (
    <div id="friend-list" className="default-root-value">
      <Helmet><title>친구 목록 | 하이틴데이</title></Helmet>

      <div className="header">
        <Header isMainPage={false} />
      </div>

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
                      <span
                        className={`friend-name${
                          friend.isBlocked ? " blocked" : ""
                        }`}
                      >
                        {friend.name}
                      </span>
                      <span className="friend-sub">
                        {friend.school} {friend.grade}
                      </span>
                    </div>
                  </div>

                  <div className="friend-actions">
                    <button title="채팅" aria-label="채팅">
                      💬
                    </button>
                    <button title="일정" aria-label="일정">
                      📅
                    </button>

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
                              onClick={() =>
                                unblockFriend(friend.id, friend.email)
                              }
                            >
                              차단 해제
                            </button>
                          ) : (
                            <button
                              type="button"
                              role="menuitem"
                              className="more-item danger"
                              onClick={() =>
                                blockFriend(friend.id, friend.email)
                              }
                            >
                              차단
                            </button>
                          )}

                          <button
                            type="button"
                            role="menuitem"
                            className="more-item"
                            onClick={() =>
                              deleteFriend(friend.id, friend.email)
                            }
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
            <li className="friend-empty">친구를 추가해보세요!</li>
          )}
        </ul>

        {showFriendAdd && (
          <div
            className="modal-overlay"
            onClick={() => setShowFriendAdd(false)}
            role="presentation"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowFriendAdd(false)}
                aria-label="친구창 닫기"
              >
                <X size={20} />
              </button>
              <FriendAdd onClose={() => setShowFriendAdd(false)} />
            </div>
          </div>
        )}
        {showAcceptFriend && (
          <div
            className="modal-overlay"
            onClick={() => setShowAcceptFriend(false)}
            role="presentation"
          >
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAcceptFriend(false)}
                aria-label="친구창 닫기"
              >
                <X size={20} />
              </button>
              <AcceptFriend
                onClose={() => setShowAcceptFriend(false)}
                onUpdatedFriends={fetchFriends}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendList;
