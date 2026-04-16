import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import "components/Default.css";
import "./PhoneChangePage.css";

function PhoneChangePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [msgType, setMsgType] = useState("info");

  // 전화번호 입력 시 숫자만, 자동 하이픈 포맷
  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
    let formatted = digits;
    if (digits.length >= 8) {
      formatted = digits.replace(/(\d{3})(\d{4})(\d{0,4})/, "$1-$2-$3");
    } else if (digits.length >= 4) {
      formatted = digits.replace(/(\d{3})(\d{0,4})/, "$1-$2");
    }
    setPhone(formatted);
  };

  // 인증번호 전송 (UI 전용 — 기능 미구현)
  const handleSendCode = () => {
    if (!phone.trim()) {
      setMsg("전화번호를 입력해 주세요."); setMsgType("error"); return;
    }
    setCodeSent(true);
    setMsg("인증번호 전송 기능은 준비 중입니다."); setMsgType("info");
  };

  // 인증하기 (UI 전용 — 기능 미구현)
  const handleVerify = () => {
    setMsg("인증 기능은 준비 중입니다."); setMsgType("info");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setMsg("전화번호를 입력해 주세요."); setMsgType("error"); return;
    }
    setLoading(true);
    try {
      await axios.patch(
        "/api/user/phone",
        { phoneNum: phone.replace(/-/g, "") },
        { withCredentials: true }
      );
      setMsg("전화번호가 변경되었습니다."); setMsgType("success");
    } catch (err) {
      setMsg(err?.response?.data?.message || "전화번호 변경 중 오류가 발생했습니다.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="default-root-value">
      <Header isMainPage={false} />

      <div className="phone-change-page">
        <Helmet><title>전화번호 변경 | 하이틴데이</title></Helmet>
        <h2 className="phone-change-title">전화번호 변경</h2>

        <form className="phone-change-form" onSubmit={handleSubmit}>
          {/* 전화번호 입력 */}
          <div className="phone-field-group">
            <label className="phone-label">전화번호</label>
            <div className="phone-input-row">
              <input
                type="tel"
                className="phone-input"
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
              />
              <button
                type="button"
                className="phone-send-btn"
                onClick={handleSendCode}
              >
                인증번호 전송
              </button>
            </div>
          </div>

          {/* 인증번호 입력 */}
          <div className="phone-field-group">
            <label className="phone-label">인증번호</label>
            <div className="phone-input-row">
              <input
                type="text"
                className="phone-input"
                placeholder={codeSent ? "인증번호를 입력하세요" : "인증번호 전송 후 입력"}
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                disabled={!codeSent}
              />
              <button
                type="button"
                className="phone-verify-btn"
                onClick={handleVerify}
                disabled={!codeSent}
              >
                인증하기
              </button>
            </div>
            <p className="phone-hint">※ 인증 없이도 전화번호 변경이 가능합니다.</p>
          </div>

          {msg && (
            <p className={`phone-msg phone-msg--${msgType}`}>{msg}</p>
          )}

          <div className="phone-change-actions">
            <button type="submit" className="phone-submit" disabled={loading}>
              {loading ? "변경 중..." : "변경하기"}
            </button>
            <button
              type="button"
              className="phone-cancel"
              onClick={() => navigate("/profile/edit")}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PhoneChangePage;
