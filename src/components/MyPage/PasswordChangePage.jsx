import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import "components/Default.css";
import "./PasswordChangePage.css";

function PasswordChangePage() {
  const navigate = useNavigate();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const lengthOk = newPw.length >= 8 && newPw.length <= 20;
    const hasLetter = /[a-zA-Z]/.test(newPw);
    const hasDigit = /\d/.test(newPw);
    const hasSpecial = /[^a-zA-Z0-9]/.test(newPw);
    const kinds = [hasLetter, hasDigit, hasSpecial].filter(Boolean).length;

    if (!currentPw) return "현재 비밀번호를 입력해 주세요.";
    if (!newPw) return "새로운 비밀번호를 입력해 주세요.";
    if (!lengthOk) return "새 비밀번호는 8~20자여야 합니다.";
    if (kinds < 2) return "영문/숫자/특수문자 중 2종 이상을 포함해야 합니다.";
    if (newPw === currentPw) return "현재 비밀번호와 다른 비밀번호를 사용해 주세요.";
    if (newPw !== confirmPw) return "비밀번호 확인이 일치하지 않습니다.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const v = validate();
    if (v) { setError(v); return; }

    try {
      setLoading(true);
      await axios.post(
        "/api/user/modify/password",
        { pastPassword: currentPw, newPassword: newPw },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      setNotice("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } catch (err) {
      if (err?.response?.status === 401) {
        setError("현재 비밀번호가 올바르지 않습니다.");
      } else {
        setError(err?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="default-root-value">
      <Header isMainPage={false} />

      <div className="pw-change-page">
        <h2 className="pw-change-title">비밀번호 변경</h2>

        <form className="pw-change-form" onSubmit={handleSubmit} noValidate>
          {/* 현재 비밀번호 */}
          <div className="pw-field-group">
            <label className="pw-label">현재 비밀번호</label>
            <div className="pw-input-wrap">
              <input
                type={showCurrent ? "text" : "password"}
                className="pw-input"
                placeholder="현재 비밀번호"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="pw-eye-btn"
                onClick={() => setShowCurrent((v) => !v)}
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div className="pw-field-group">
            <label className="pw-label">새로운 비밀번호</label>
            <div className="pw-input-wrap">
              <input
                type={showNew ? "text" : "password"}
                className="pw-input"
                placeholder="영문, 숫자, 특수문자 2종류 이상, 8~20자"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-eye-btn"
                onClick={() => setShowNew((v) => !v)}
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="pw-hint">영문, 숫자, 특수문자 중 2종류 이상 조합, 8~20자</p>
          </div>

          {/* 비밀번호 확인 */}
          <div className="pw-field-group">
            <label className="pw-label">비밀번호 확인</label>
            <div className="pw-input-wrap">
              <input
                type={showConfirm ? "text" : "password"}
                className="pw-input"
                placeholder="새 비밀번호 확인"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="pw-eye-btn"
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="pw-msg pw-error">{error}</p>}
          {notice && <p className="pw-msg pw-notice">{notice}</p>}

          <div className="pw-change-actions">
            <button type="submit" className="pw-submit" disabled={loading}>
              {loading ? "처리 중..." : "변경하기"}
            </button>
            <button
              type="button"
              className="pw-cancel"
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

export default PasswordChangePage;
