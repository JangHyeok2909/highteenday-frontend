import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X } from "lucide-react";
import "./AcceptFriend.css";

const AcceptFriend = ({ onClose, onUpdatedFriends }) => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/friends/requests/received", {
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

  const getReqId = (req) => req.friendsReqId ?? req.id;

  const handleAccept = async (e, req) => {
    e.stopPropagation();
    const id = getReqId(req);
    setLoadingId(id);
    setMessage("");
    try {
      await axios.post(
        "/api/friends/respond",
        { id, status: "ACCEPTED" },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => getReqId(r) !== id));
      setMessage("친구 요청을 수락했습니다.");
      if (onUpdatedFriends) {
        onUpdatedFriends();
      }
    } catch (err) {
      console.error("친구 요청 수락 실패:", err);
      setMessage("수락에 실패했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (e, req) => {
    e.stopPropagation();
    const id = getReqId(req);
    setLoadingId(id);
    setMessage("");
    try {
      await axios.post(
        "/api/friends/respond",
        { id, status: "REJECTED" },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => getReqId(r) !== id));
      setMessage("친구 요청을 거절했습니다.");
    } catch (err) {
      console.error("친구 요청 거절 실패:", err);
      setMessage("거절에 실패했습니다.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div id="accept-friend">
      <div className="acceptfriend-container">
        <h3 className="acceptfriend-title">친구 요청 목록</h3>

        <ul className="acceptfriend-list">
          {requests.length === 0 ? (
            <li className="acceptfriend-empty">대기 중인 요청이 없습니다.</li>
          ) : (
            requests.map((req) => {
              const id = getReqId(req);
              const isLoading = loadingId === id;
              return (
                <li key={id} className="acceptfriend-item">
                  <span className="acceptfriend-item-name">{req.name}</span>
                  <div className="acceptfriend-item-actions">
                    <button
                      type="button"
                      className="acceptfriend-icon-btn acceptfriend-icon-btn--accept"
                      onClick={(e) => handleAccept(e, req)}
                      disabled={isLoading}
                      aria-label="수락"
                      title="수락"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      type="button"
                      className="acceptfriend-icon-btn acceptfriend-icon-btn--reject"
                      onClick={(e) => handleReject(e, req)}
                      disabled={isLoading}
                      aria-label="거절"
                      title="거절"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </li>
              );
            })
          )}
        </ul>

        {message && <p className="acceptfriend-message">{message}</p>}
      </div>
    </div>
  );
};

export default AcceptFriend;
