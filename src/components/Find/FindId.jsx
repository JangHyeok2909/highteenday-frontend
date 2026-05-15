import React from "react";
import "./FindId.css";

function FindId({ isOpen, onClose, onSwitchToPw }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePhoneAuth = () => {
    console.log("휴대폰 인증 클릭");
  };

  const handleEmailAuth = () => {
    console.log("이메일 인증 클릭");
  };

  if (!isOpen) return null;

  return (
    <div id="find-id">
      <div className="find-id-overlay" onClick={handleOverlayClick}>
        <div className="find-id-modal">
          {/* 닫기 버튼 */}
          <button className="modal-close-btn" onClick={onClose}>✕</button>

          {/* 탭 헤더 */}
          <div className="tab-header">
            <button className="tab-button active">아이디 찾기</button>
            <button className="tab-button" onClick={onSwitchToPw}>
              비밀번호 찾기
            </button>
          </div>

          {/* 컨텐츠 */}
          <div className="modal-content">
            <p className="modal-description">
              가입 시 등록한 정보로 아이디를 찾을 수 있어요.
            </p>

            <div className="auth-options">
              <button className="auth-button" onClick={handlePhoneAuth}>
                <div className="auth-icon-wrap">
                  <span className="auth-icon">📱</span>
                </div>
                <div className="auth-text">
                  <span className="auth-title">휴대폰 인증</span>
                  <span className="auth-sub">등록된 휴대폰으로 인증</span>
                </div>
                <span className="auth-arrow">›</span>
              </button>

              <button className="auth-button" onClick={handleEmailAuth}>
                <div className="auth-icon-wrap">
                  <span className="auth-icon">✉️</span>
                </div>
                <div className="auth-text">
                  <span className="auth-title">이메일 인증</span>
                  <span className="auth-sub">등록된 이메일로 인증</span>
                </div>
                <span className="auth-arrow">›</span>
              </button>
            </div>

            <p className="modal-footer-note">
              가입 정보가 기억나지 않으시면{" "}
              <span className="modal-link">고객센터</span>로 문의해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindId;
