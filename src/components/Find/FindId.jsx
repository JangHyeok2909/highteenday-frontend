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
    // 휴대폰 인증 기능은 나중에 별도 파일에서 구현
  };

  const handleEmailAuth = () => {
    console.log("이메일 인증 클릭");
    // 이메일 인증 기능은 나중에 별도 파일에서 구현
  };

  if (!isOpen) return null;

  return (
    <div className="find-id-overlay" onClick={handleOverlayClick}>
      <div className="find-id-modal">
        {/* 탭 헤더 */}
        <div className="tab-header">
          <button className="tab-button active">
            아이디 찾기
          </button>
          <button className="tab-button" onClick={onSwitchToPw}>
            비밀번호 찾기
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="modal-content">
          <div className="auth-options">
            <button className="auth-button" onClick={handlePhoneAuth}>
              <div className="auth-icon">📱</div>
              <span>휴대폰 인증</span>
            </button>
            
            <button className="auth-button" onClick={handleEmailAuth}>
              <div className="auth-icon">✉️</div>
              <span>이메일 인증</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindId;