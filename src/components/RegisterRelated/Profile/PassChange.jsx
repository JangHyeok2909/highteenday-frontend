import { useState } from "react";
import axios from "axios";
import "./PassChange.css";

function PassChange() {
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

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

      const res = await axios.post(
        "/api/user/modify/password",
        {
          pastPassword: currentPw, 
          newPassword: newPw,     
        },
        {
          withCredentials: true,
          timeout: 10000,
          headers: { "Content-Type": "application/json" },
        }
      );

      const ok =
        (res.status >= 200 && res.status < 300) ||
        res?.data?.success === true;

      if (ok) {
        setNotice("비밀번호가 성공적으로 변경되었습니다.");
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        setError(res?.data?.message || "비밀번호 변경에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        setError("로그인이 필요합니다. 다시 로그인해 주세요.");
      } else {
        const msg = err?.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="pass-change">
      <div className="pc-wrapper">
        <header className="pc-header">
          <h1 className="pc-title">비밀번호 변경하기</h1>
        </header>

        <form className="pc-form" onSubmit={handleSubmit} noValidate>
          <div className="pc-row">
            <label htmlFor="currentPw" className="pc-label">현재 비밀번호</label>
            <input
              id="currentPw"
              type="password"
              className="pc-input"
              placeholder="현재 비밀번호"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <div className="pc-row">
            <label htmlFor="newPw" className="pc-label">새로운 비밀번호</label>
            <input
              id="newPw"
              type="password"
              className="pc-input"
              placeholder="영문, 숫자, 특수 문자 2종류 이상 조합된 8~20자"
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              autoComplete="new-password"
            />
            <p className="pc-hint">영문, 숫자, 특수 문자 2종류 이상 조합된 8~20자</p>
          </div>

          <div className="pc-row">
            <label htmlFor="confirmPw" className="pc-label">비밀번호 확인</label>
            <input
              id="confirmPw"
              type="password"
              className="pc-input"
              placeholder="새 비밀번호 확인"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          {error && <div className="pc-msg pc-error" aria-live="polite">{error}</div>}
          {notice && <div className="pc-msg pc-notice" aria-live="polite">{notice}</div>}

          <button type="submit" className="pc-submit" disabled={loading} aria-busy={loading}>
            {loading ? "처리 중..." : "확인"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PassChange;
