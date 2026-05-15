import React, { useState } from "react";
import "./FindPw.css";

function FindPw({ isOpen, onClose, onSwitchToId }) {
  const [email, setEmail] = useState("");

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFindPassword = () => {
    console.log("찾기 버튼 클릭", email);
  };

  if (!isOpen) return null;

  return (
    <div id="find-pw">
      <div className="find-pw-overlay" onClick={handleOverlayClick}>
        <div className="find-pw-modal">
          {/* 닫기 버튼 */}
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          {/* 탭 헤더 */}
          <div className="tab-header">
            <button className="tab-button" onClick={onSwitchToId}>
              아이디 찾기
            </button>
            <button className="tab-button active">비밀번호 찾기</button>
          </div>

          {/* 컨텐츠 */}
          <div className="modal-content">
            <div className="pw-header">
              <div className="pw-icon-wrap">🔒</div>
              <h3 className="pw-title">비밀번호를 잊으셨나요?</h3>
              <p className="pw-description">
                가입 시 등록한 이메일 주소를 입력하면<br />
                비밀번호 재설정 링크를 보내드릴게요.
              </p>
            </div>

            <div className="input-section">
              <label className="input-label">이메일 주소</label>
              <input
                type="email"
                placeholder="example@email.com"
                className="email-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              className="find-button"
              onClick={handleFindPassword}
              disabled={!email}
            >
              비밀번호 재설정 메일 보내기
            </button>

            <p className="modal-footer-note">
              이메일이 기억나지 않으시면{" "}
              <span className="modal-link">고객센터</span>로 문의해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindPw;
