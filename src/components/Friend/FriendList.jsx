import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FriendList.css";

const FriendList = () => {
  // 임시 테스트용 친구 데이터
  const testFriends = [
    { id: 1, name: "홍길동" },
    { id: 2, name: "김철수" },
    { id: 3, name: "이영희" },
  ];

  const [friends, setFriends] = useState(testFriends);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteButtonText, setDeleteButtonText] = useState("친구 삭제");

  const navigate = useNavigate();

  /*
  // 실제 API 호출용 (테스트 시 주석 처리)
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/friends/list", { withCredentials: true });
        setFriends(res.data);
        setError(null);
      } catch (err) {
        setError("친구 목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);
  */

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const onDeleteClick = async () => {
    if (!showCheckboxes) {
      setShowCheckboxes(true);
      setSelectedIds(new Set());
      setDeleteButtonText("삭제 취소");
    } else {
      if (selectedIds.size === 0) {
        setDeleteButtonText("친구 삭제");
        setShowCheckboxes(false);
        return;
      }

      if (!window.confirm("선택한 친구를 정말 삭제하시겠습니까?")) return;

      setLoading(true);

      /*
      // 실제 API 호출용 (테스트 시 주석 처리)
      try {
        await axios.post(
          "/api/friends/delete",
          { ids: Array.from(selectedIds) },
          { withCredentials: true }
        );
        const res = await axios.get("/api/friends/list", { withCredentials: true });
        setFriends(res.data);
        setError(null);
      } catch (err) {
        setError("친구 삭제 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
      */

      // 테스트용 로컬 삭제 처리
      setTimeout(() => {
        setFriends((prev) => prev.filter((f) => !selectedIds.has(f.id)));
        setSelectedIds(new Set());
        setShowCheckboxes(false);
        setLoading(false);
        setDeleteButtonText("친구 삭제");
      }, 500);
    }
  };

  if (loading) return <div className="friends-container">처리 중...</div>;
  if (error) return <div className="friends-container error">{error}</div>;

  return (
    <div className="friends-container">
      <h2 className="friends-header">친구 목록</h2>
      <ul className="friends-list">
        {friends.length === 0 ? (
          <li className="friend-item">친구가 없습니다.</li>
        ) : (
          friends.map((friend) => (
            <li key={friend.id} className="friend-item">
              {showCheckboxes && (
                <input
                  type="checkbox"
                  checked={selectedIds.has(friend.id)}
                  onChange={() => toggleSelect(friend.id)}
                  style={{ marginRight: "10px" }}
                />
              )}
              <span className="friend-name">{friend.name}</span>
            </li>
          ))
        )}
      </ul>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => navigate("/friendAdd")}
          style={{ marginRight: "10px" }}
          disabled={showCheckboxes}
        >
          친구 추가
        </button>
        <button onClick={onDeleteClick}>{deleteButtonText}</button>
      </div>
    </div>
  );
};

export default FriendList;
