import React from "react";
import { Megaphone } from "lucide-react";
import "./NoticeSection.css";

function NoticeSection() {
  return (
    <div className="notice-banner">
      <span className="notice-banner__icon">
        <Megaphone size={18} />
      </span>
      <div className="notice-banner__text">
        <span className="notice-banner__label">학교 소식지</span>
        <span className="notice-banner__content">
          하이틴데이에 오신 걸 환영합니다! 친구들과 소통하고, 급식·시간표를
          한눈에 확인하세요.
        </span>
      </div>
    </div>
  );
}

export default NoticeSection;
