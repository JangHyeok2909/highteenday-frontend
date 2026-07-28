import React, { useState } from "react";
import axios from "axios";
import { Button, Input } from "../ui";
import "./FriendAdd.css";

const FriendAdd = () => {
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setMessage("닉네임을 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        "/api/friends/request",
        { nickname: inputValue },
        { withCredentials: true }
      );

      if (res.data && res.data.success === false) {
        setMessage(res.data.message || "존재하지 않는 사용자입니다.");
        return;
      }

      setMessage(res.data.message || "신청 완료!");
    } catch (err: any) {
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
    <div className="friend-add">
      <form onSubmit={handleSubmit} className="friend-add__form">
        <Input
          type="text"
          placeholder="닉네임 입력"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button type="submit">신청하기</Button>
      </form>
      {message && <p className="friend-add__message">{message}</p>}
    </div>
  );
};

export default FriendAdd;
