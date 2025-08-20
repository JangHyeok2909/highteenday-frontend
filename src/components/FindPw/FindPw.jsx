import React from "react";
import "./FindPw.css";

function FindPw({ isOpen, onClose, onSwitchToId }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFindPassword = () => {
    console.log("찾기 버튼 클릭");
    // 비밀번호 찾기 기능은 나중에 별도 파일에서 구현
  };

  if (!isOpen) return null;

  return (
    <div className="find-pw-overlay" onClick={handleOverlayClick}>
      <div className="find-pw-modal">
        {/* 탭 헤더 */}
        <div className="tab-header">
          <button className="tab-button" onClick={onSwitchToId}>
            아이디 찾기
          </button>
          <button className="tab-button active">
            비밀번호 찾기
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="modal-content">
          <p className="description">
            비밀번로 찾기 위해 사용자의 아이디를 입력해 주세요
          </p>
          
          <div className="input-section">
            <input
              type="email"
              placeholder=""
              className="email-input"
            />
          </div>
          
          <button className="find-button" onClick={handleFindPassword}>
            찾기
          </button>
        </div>
      </div>
    </div>
  );
}

export default FindPw;