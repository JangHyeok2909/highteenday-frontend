import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AcceptFriend.css";

const AcceptFriend = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/friends/requests/received", {
          withCredentials: true,
        });
        setRequests(res.data || []);
        console.log(res);
      } catch (err) {
        console.error("친구 요청 목록 불러오기 실패:", err);
        setMessage("목록을 불러오지 못했습니다.");
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (e) => {
    e.preventDefault();
    console.log(selectedId);
    if (!selectedId) {
      setMessage("수락할 친구를 선택하세요.");
      return;
    }
    try {
      const res = await axios.post(
        "/api/friends/respond", { 
          id: selectedId,
          status: "ACCEPTED"
         },
        { withCredentials: true },
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
    <div id="accept-friend">
      <div className="acceptfriend-container">
        <h3 className="acceptfriend-title">친구 수락</h3>

        <ul className="acceptfriend-list">
          {requests.length === 0 ? (
            <li className="acceptfriend-empty">대기 중인 요청이 없습니다.</li>
          ) : (
            requests.map((req) => (
              <li
                key={req.friendsReqId}
                className={`acceptfriend-item ${
                  selectedId === req.friendsReqId ? "selected" : ""
                }`}
                onClick={() => setSelectedId(req.friendsReqId)}
              >
                {req.name}
              </li>
            ))
          )}
        </ul>

        <form onSubmit={handleAccept} className="acceptfriend-form">
          <button type="submit" className="acceptfriend-submit">
            수락하기
          </button>
        </form>

        <form onSubmit={(e) => { e.preventDefault(); onClose?.(); }}>
          <button type="submit" className="close-btn">
            닫기
          </button>
        </form>

        {message && <p className="acceptfriend-message">{message}</p>}
      </div>
    </div>
  );
};

export default AcceptFriend;
