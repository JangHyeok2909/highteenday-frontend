import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FriendList.css";
import FriendAdd from "./FriendAdd";
import AcceptFriend from "./AcceptFriend";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [showFriendAdd, setShowFriendAdd] = useState(false);
  const [showAcceptFriend, setShowAcceptFriend] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // 친구 목록 API 호출
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("/api/friends/list", {
          withCredentials: true,
        });
        setFriends(res.data || []);
      } catch (err) {
        console.error("친구 목록 불러오기 실패:", err);
      }
    };

    fetchFriends();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return alert("검색어를 입력해주세요");
    console.log("검색 기능 호출:", searchTerm);
    // TODO: 검색 API 연동 시 여기서 호출
  };

  return (
    <div id="friend-list">
      <div className="friend-container">
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="친구 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        <div className="action-buttons">
          <button type="button" onClick={() => setShowFriendAdd(true)}>
            친구 신청
          </button>
          <button type="button" onClick={() => setShowAcceptFriend(true)}>
            친구 수락
          </button>
        </div>

        <ul className="friend-list">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <li key={friend.id} className="friend-card">
                <span className="friend-name">{friend.name}</span>
                <div className="friend-actions">
                  <button type="button">삭제</button>
                  <button type="button">차단</button>
                  <button type="button">채팅</button>
                </div>
              </li>
            ))
          ) : (
            <li className="friend-empty">친구가 한 명도 없어요 ㅠㅠ</li>
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
          <div
            className="modal-overlay"
            onClick={() => setShowAcceptFriend(false)}
          >
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
