import axios from "axios";

/**
 * 친구 관계 상태. 서버 RelationStatus와 값이 일치해야 한다.
 *
 * 상대가 나를 차단한 경우는 여기에 값이 없다. 서버가 그런 관계를 NONE으로 내려보내고
 * 실제 동작에서만 거절하는데, 차단 사실이 상대에게 드러나면 안 되기 때문이다.
 */
export const RELATION = {
  SELF: "SELF",
  FRIEND: "FRIEND",
  REQUEST_SENT: "REQUEST_SENT",
  REQUEST_RECEIVED: "REQUEST_RECEIVED",
  NONE: "NONE",
};

export const isFriend = (relation) => relation === RELATION.FRIEND;

export const sendFriendRequest = (targetUserId) =>
  axios.post("/api/friends/request", { targetUserId }, { withCredentials: true });

export const cancelFriendRequest = (targetUserId) =>
  axios.delete(`/api/friends/request/${targetUserId}`, { withCredentials: true });

export const searchUsersByNickname = async (nickname) => {
  const { data } = await axios.post(
    "/api/friends/search",
    { nickname },
    { withCredentials: true }
  );
  return Array.isArray(data) ? data : [];
};

// 친구에게만 열린다. 친구가 아니면 404이므로 호출한 쪽에서 그대로 처리한다.
export const fetchUserProfile = async (userId) => {
  const { data } = await axios.get(`/api/user/${userId}/profile`, {
    withCredentials: true,
  });
  return data;
};
