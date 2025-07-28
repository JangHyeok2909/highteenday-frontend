import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FriendList.css";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/friends", { withCredentials: true })
      .then((res) => {
        setFriends(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("친구 목록 불러오기 실패:", err);
        setError("친구 목록을 불러오지 못했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="friends-container">불러오는 중...</div>;
  if (error) return <div className="friends-container error">{error}</div>;

  return (
    <div className="friends-container">
      <h2 className="friends-header">친구 목록</h2>
      <ul className="friends-list">
        {friends.map((friend) => (
          <li key={friend.id} className="friend-item">
            <span className="friend-name">{friend.name}</span>
            <span
              className={`friend-status ${friend.online ? "online" : "offline"}`}
            >
              {friend.online ? "온라인" : "오프라인"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
//테스트 테스트

export default FriendList;
