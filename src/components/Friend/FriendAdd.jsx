import React, { useState } from "react";
import axios from "axios";
import "./FriendAdd.css";

const FriendAdd = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!inputValue.trim()) {
      setMessage("아이디나 이름을 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/friends/request",
        { targetUserId: inputValue },
        { withCredentials: true }
      );

      setMessage(res.data.message || "신청 완료!");
    } catch (err) {
      setMessage(
        "신청 실패: " +
          (err.response?.data?.message || err.message || "알 수 없는 오류")
      );
    } finally {
      setInputValue("");
      setTimeout(() => setMessage(""), 3000); 
    }
  };

  return (
    <div className="friendadd-container">
      <h3 className="friendadd-title">친구 신청</h3>
      <input
        type="text"
        placeholder="친구 이름 또는 아이디"
        className="friendadd-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="friendadd-submit" onClick={handleSubmit}>
        신청하기
      </button>
      {message && <p className="friendadd-message">{message}</p>}
    </div>
  );
};

export default FriendAdd;
