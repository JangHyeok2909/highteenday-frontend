import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcceptFriend.css";

const AcceptFriend = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");

  // 친구 요청 목록 API 호출
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/friends/requests", {
          withCredentials: true,
        });
        setRequests(res.data || []);
      } catch (err) {
        console.error("친구 요청 목록 불러오기 실패:", err);
        setMessage("목록을 불러오지 못했습니다.");
      }
    };

    fetchRequests();
  }, []);

  // 친구 요청 수락 API 호출
  const handleAccept = async () => {
    if (!selectedId) {
      setMessage("수락할 친구를 선택하세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/friends/accept",
        { requestId: selectedId },
        { withCredentials: true }
      );
      setMessage(res.data.message || "친구 요청을 수락했습니다.");
      setRequests((prev) => prev.filter((req) => req.id !== selectedId));
      setSelectedId(null);
    } catch (err) {
      console.error("친구 요청 수락 실패:", err);
      setMessage("수락에 실패했습니다.");
    }
  };

  return (
    <div className="acceptfriend-container">
      <h3 className="acceptfriend-title">친구 수락</h3>

      <ul className="acceptfriend-list">
        {requests.length === 0 ? (
          <li className="acceptfriend-empty">대기 중인 요청이 없습니다.</li>
        ) : (
          requests.map((req) => (
            <li
              key={req.id}
              className={`acceptfriend-item ${
                selectedId === req.id ? "selected" : ""
              }`}
              onClick={() => setSelectedId(req.id)}
            >
              {req.name}
            </li>
          ))
        )}
      </ul>

      <button className="acceptfriend-submit" onClick={handleAccept}>
        수락하기
      </button>

      <button className="close-btn" onClick={onClose}>
        닫기
      </button>

      {message && <p className="acceptfriend-message">{message}</p>}
    </div>
  );
};

export default AcceptFriend;
