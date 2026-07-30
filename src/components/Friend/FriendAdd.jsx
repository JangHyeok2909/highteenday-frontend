import React, { useState } from "react";
import defaultProfile from "../../assets/default_profile_image.jpg";
import {
  RELATION,
  searchUsersByNickname,
  sendFriendRequest,
} from "../../utils/friendApi";
import "./FriendAdd.css";

/**
 * 닉네임으로 찾아서 요청을 보낸다.
 *
 * 예전에는 닉네임만 적어 곧바로 보냈는데, 닉네임에는 유니크 제약이 없고 변경도 가능해서
 * 화면에서 생각한 사람과 실제 수신자가 달라질 수 있었다. 이제는 검색으로 확인한 뒤
 * 그 사람의 id로 보낸다.
 */
const FriendAdd = () => {
  const [inputValue, setInputValue] = useState("");
  const [results, setResults] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    const nickname = inputValue.trim();
    if (!nickname) {
      setMessage("닉네임을 입력하세요.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const found = await searchUsersByNickname(nickname);
      setResults(found);
      if (found.length === 0) setMessage("존재하지 않는 사용자입니다.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "검색에 실패했습니다.");
      setResults(null);
    } finally {
      setBusy(false);
    }
  };

  const handleRequest = async (target) => {
    setBusy(true);
    setMessage("");
    try {
      await sendFriendRequest(target.userId);
      setResults((prev) =>
        prev.map((u) =>
          u.userId === target.userId ? { ...u, relation: RELATION.REQUEST_SENT } : u
        )
      );
      setMessage("친구 신청을 보냈습니다.");
    } catch (err) {
      setMessage(err?.response?.data?.message || "신청에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const relationLabel = (relation) => {
    if (relation === RELATION.FRIEND) return "이미 친구";
    if (relation === RELATION.REQUEST_SENT) return "신청함";
    if (relation === RELATION.REQUEST_RECEIVED) return "받은 요청 있음";
    if (relation === RELATION.SELF) return "나";
    return null;
  };

  return (
    <div id="friend-add">
      <div className="friendadd-container">
        <h3 className="friendadd-title">친구 신청</h3>
        <form onSubmit={handleSearch} className="friendadd-form">
          <input
            type="text"
            placeholder="닉네임 입력"
            className="friendadd-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="friendadd-submit" disabled={busy}>
            검색
          </button>
        </form>

        {message && <p className="friendadd-message">{message}</p>}

        {results && results.length > 0 && (
          <ul className="friendadd-results">
            {results.map((u) => (
              <li key={u.userId} className="friendadd-result">
                <img
                  src={u.profileUrl || defaultProfile}
                  alt={`${u.nickname} 프로필`}
                  onError={(e) => { e.currentTarget.src = defaultProfile; }}
                />
                <span className="friendadd-result-name">{u.nickname}</span>
                {u.relation === RELATION.NONE ? (
                  <button
                    type="button"
                    className="friendadd-request"
                    onClick={() => handleRequest(u)}
                    disabled={busy}
                  >
                    신청하기
                  </button>
                ) : (
                  <span className="friendadd-result-state">{relationLabel(u.relation)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendAdd;
