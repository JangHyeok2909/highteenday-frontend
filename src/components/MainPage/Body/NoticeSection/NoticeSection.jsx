import React from "react";
import "./NoticeSection.css";
import "../../../Default.css"

function NoticeSection() {
  return (
    <div id="notice-section">
        <div className="notice-content">
            <span className="notice-icon">📢</span>
            <div>
                <div className="title">학교 소식지</div>
                <div className="content">하이틴데이에 오신 걸 환영합니다! 친구들과 소통하고, 급식·시간표를 한눈에 확인하세요.</div>
            </div>
        </div>
    </div>
  );
}

export default NoticeSection;