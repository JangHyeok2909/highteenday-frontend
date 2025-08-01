import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./FriendList.css";

const FriendList = () => {
  const [friends, setFriends] = useState([
    { id: 1, name: "홍길동" },
    { id: 2, name: "김철수" },
    { id: 3, name: "이영희" },
  ]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteButtonText, setDeleteButtonText] = useState("친구 삭제");

  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const onDeleteClick = () => {
    if (!showCheckboxes) {
      setShowCheckboxes(true);
      setSelectedIds(new Set());
    } else {
      if (selectedIds.size === 0) {
        // 체크한 친구 없을 때 텍스트 바꾸기
        setDeleteButtonText("삭제 취소");
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setDeleteButtonText("친구 삭제");
        }, 1500);

        // 삭제 모드도 취소 처리
        setShowCheckboxes(false);
        return;
      }

      if (!window.confirm("선택한 친구를 정말 삭제하시겠습니까?")) return;

      setLoading(true);

      // 실제 API 호출 주석 처리
      /*
      try {
        await axios.post(
          "/api/friends/delete",
          { ids: Array.from(selectedIds) },
          { withCredentials: true }
        );
      } catch (err) {
        setError("친구 삭제 중 오류가 발생했습니다.");
        setLoading(false);
        return;
      }
      */

      setTimeout(() => {
        setFriends((prev) => prev.filter((f) => !selectedIds.has(f.id)));
        setSelectedIds(new Set());
        setShowCheckboxes(false);
        setLoading(false);
        setDeleteButtonText("친구 삭제"); // 혹시 변경됐을 때 대비
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
