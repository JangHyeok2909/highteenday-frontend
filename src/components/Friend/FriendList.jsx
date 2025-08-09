import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FriendList.css";
import FriendAdd from "./FriendAdd";
import AcceptFriend from "./AcceptFriend";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [showFriendAdd, setShowFriendAdd] = useState(false);
  const [showAcceptFriend, setShowAcceptFriend] = useState(false);

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

  return (
    <div className="friends-container">
      <div className="search-container">
        <input type="text" placeholder="친구 검색" />
        <button>검색</button>
      </div>

      <div className="action-buttons">
        <button onClick={() => setShowFriendAdd(true)}>친구 신청</button>
        <button onClick={() => setShowAcceptFriend(true)}>친구 수락</button>
      </div>

      <ul className="friend-list">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <li key={friend.id} className="friend-card">
              <span className="friend-name">{friend.name}</span>
              <div className="friend-actions">
                <button>삭제</button>
                <button>차단</button>
                <button>채팅</button>
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
        <div className="modal-overlay" onClick={() => setShowAcceptFriend(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AcceptFriend onClose={() => setShowAcceptFriend(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendList;
