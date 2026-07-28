import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, UserPlus } from "lucide-react";
import { Badge, Card } from "../ui";
import "./AcceptFriend.css";

interface FriendRequest {
  friendsReqId?: number;
  id?: number;
  name: string;
}

interface AcceptFriendProps {
  onUpdatedFriends?: () => void;
}

const AcceptFriend = ({ onUpdatedFriends }: AcceptFriendProps) => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [message, setMessage] = useState("");
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/friends/requests/received", {
          withCredentials: true,
        });
        setRequests(res.data || []);
      } catch (err) {
        console.error("친구 요청 목록 불러오기 실패:", err);
      }
    };
    fetchRequests();
  }, []);

  const getReqId = (req: FriendRequest): number =>
    (req.friendsReqId ?? req.id) as number;

  const respond = async (
    e: React.MouseEvent,
    req: FriendRequest,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    e.stopPropagation();
    const id = getReqId(req);
    setLoadingId(id);
    setMessage("");
    try {
      await axios.post(
        "/api/friends/respond",
        { id, status },
        { withCredentials: true }
      );
      setRequests((prev) => prev.filter((r) => getReqId(r) !== id));
      if (status === "ACCEPTED") {
        setMessage("친구 요청을 수락했습니다.");
        onUpdatedFriends?.();
      } else {
        setMessage("친구 요청을 거절했습니다.");
      }
    } catch (err) {
      console.error("친구 요청 응답 실패:", err);
      setMessage(
        status === "ACCEPTED" ? "수락에 실패했습니다." : "거절에 실패했습니다."
      );
    } finally {
      setLoadingId(null);
    }
  };

  if (requests.length === 0) return null;

  return (
    <Card
      className="accept-friend"
      title={
        <div className="accept-friend__head">
          <UserPlus size={16} />
          <span>친구 요청</span>
          <Badge tone="primary">{requests.length}</Badge>
        </div>
      }
    >
      <ul className="accept-friend__list">
        {requests.map((req) => {
          const id = getReqId(req);
          const isLoading = loadingId === id;
          return (
            <li key={id} className="accept-friend__item">
              <span className="accept-friend__name">{req.name}</span>
              <div className="accept-friend__actions">
                <button
                  type="button"
                  className="accept-friend__btn accept-friend__btn--accept"
                  onClick={(e) => respond(e, req, "ACCEPTED")}
                  disabled={isLoading}
                  aria-label="수락"
                  title="수락"
                >
                  <Check size={16} />
                </button>
                <button
                  type="button"
                  className="accept-friend__btn accept-friend__btn--reject"
                  onClick={(e) => respond(e, req, "REJECTED")}
                  disabled={isLoading}
                  aria-label="거절"
                  title="거절"
                >
                  <X size={16} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {message && <p className="accept-friend__message">{message}</p>}
    </Card>
  );
};

export default AcceptFriend;
