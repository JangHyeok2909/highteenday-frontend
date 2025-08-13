import React, { useState } from "react";
import axios from "axios";
import "./FriendAdd.css";

const FriendAdd = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setMessage("이메일을 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/friends/request",
        { email: inputValue },
        { withCredentials: true }
      );

      if (res.data && res.data.success === false) {
        setMessage(res.data.message || "존재하지 않는 사용자입니다.");
        return;
      }

      setMessage(res.data.message || "신청 완료!");
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("존재하지 않는 사용자입니다.");
      } else if (err.response?.status === 403) {
        setMessage("이미 신청했거나 신청할 수 없는 사용자입니다.");
      } else {
        setMessage(
          "신청 실패: " +
            (err.response?.data?.message || err.message || "알 수 없는 오류")
        );
      }
    } finally {
      setInputValue("");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div id="friend-add">
      <div className="friendadd-container">
        <h3 className="friendadd-title">친구 신청</h3>
        <form onSubmit={handleSubmit} className="friendadd-form">
          <input
            type="text"
            placeholder="이메일 입력"
            className="friendadd-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="friendadd-submit">
            신청하기
          </button>
        </form>
        {message && <p className="friendadd-message">{message}</p>}
      </div>
    </div>
  );
};

export default FriendAdd;