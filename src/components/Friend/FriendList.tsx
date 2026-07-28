import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Search, MoreVertical, UserPlus } from "lucide-react";
import axios from "axios";
import FriendAdd from "./FriendAdd";
import AcceptFriend from "./AcceptFriend";
import { Avatar, Button, Card, EmptyState, Input, Modal } from "../ui";
import "./FriendList.css";

interface FriendItem {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  school?: string;
  grade?: string;
  profileUrl?: string | null;
  isBlocked?: boolean;
}

const FriendList = () => {
  const [friends, setFriends] = useState<FriendItem[]>([]);
  const [showFriendAdd, setShowFriendAdd] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchFriends = useCallback(async () => {
    try {
      const res = await axios.get("/api/friends/list", {
        withCredentials: true,
      });
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
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    if (!kw) return friends;
    return friends.filter((f) =>
      [f.name ?? "", f.school ?? "", f.grade ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(kw)
    );
  }, [friends, searchTerm]);

  const toggleMenu = (id: number) =>
    setOpenMenuId((prev) => (prev === id ? null : id));

  const blockFriend = async (id: number, email: string) => {
    try {
      await axios.patch(
        "/api/friends/block",
        { id, email },
        { withCredentials: true }
      );
      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isBlocked: true } : f))
      );
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("차단 실패:", err);
      alert(err?.response?.data?.message || "차단에 실패했습니다.");
    }
  };

  const unblockFriend = async (id: number, email: string) => {
    try {
      await axios.patch(
        "/api/friends/unblock",
        { id, email },
        { withCredentials: true }
      );
      setFriends((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isBlocked: false } : f))
      );
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("차단 해제 실패:", err);
      alert(err?.response?.data?.message || "차단 해제에 실패했습니다.");
    }
  };

  const deleteFriend = async (id: number, email: string) => {
    try {
      await axios.delete("/api/friends/delete", {
        data: { id, email },
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setFriends((prev) => prev.filter((f) => f.id !== id));
      setOpenMenuId(null);
    } catch (err: any) {
      console.error("친구 삭제 실패:", err);
      alert(err?.response?.data?.message || "친구 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="friend-page default-root-value">
      <Helmet>
        <title>친구 목록 | 하이틴데이</title>
      </Helmet>

      <div className="friend-page__head">
        <h1 className="friend-page__title">친구</h1>
        <div className="friend-page__toolbar">
          <div className="friend-page__search">
            <Search size={16} className="friend-page__search-icon" />
            <Input
              type="text"
              placeholder="친구 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="친구 검색 입력"
            />
          </div>
          <Button size="md" onClick={() => setShowFriendAdd(true)}>
            <UserPlus size={15} /> 친구 추가
          </Button>
        </div>
      </div>

      <AcceptFriend onUpdatedFriends={fetchFriends} />

      <Card flush>
        {filtered.length > 0 ? (
          <ul className="friend-list">
            {filtered.map((friend) => {
              const isOpen = openMenuId === friend.id;
              return (
                <li key={friend.id} className="friend-list__item">
                  <Avatar
                    src={friend.profileUrl}
                    alt={`${friend.name ?? "사용자"} 프로필`}
                    size={44}
                  />

                  <div className="friend-list__text">
                    <span
                      className={`friend-list__name${
                        friend.isBlocked ? " friend-list__name--blocked" : ""
                      }`}
                    >
                      {friend.name}
                      {friend.isBlocked && (
                        <span className="friend-list__blocked-tag">차단됨</span>
                      )}
                    </span>
                    <span className="friend-list__sub">
                      {[friend.school, friend.grade].filter(Boolean).join(" ")}
                    </span>
                  </div>

                  <div className="friend-list__actions">
                    <div className="friend-list__more" ref={isOpen ? menuRef : null}>
                      <button
                        type="button"
                        className="friend-list__more-btn"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(friend.id);
                        }}
                        title="더보기"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {isOpen && (
                        <div className="friend-list__menu" role="menu">
                          {friend.isBlocked ? (
                            <button
                              type="button"
                              role="menuitem"
                              className="friend-list__menu-item"
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
                              className="friend-list__menu-item friend-list__menu-item--danger"
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
                            className="friend-list__menu-item"
                            onClick={() => deleteFriend(friend.id, friend.email)}
                          >
                            친구 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyState message="친구를 추가해보세요!" />
        )}
      </Card>

      <Modal
        isOpen={showFriendAdd}
        onClose={() => setShowFriendAdd(false)}
        title="친구 신청"
        width={400}
      >
        <FriendAdd />
      </Modal>
    </div>
  );
};

export default FriendList;
