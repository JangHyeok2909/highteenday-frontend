import React from "react";
import "./NoticeSection.css";
import "../../../Default.css"

function NoticeSection() {
  return (
    <div id="notice-section">
        <div className="notice-content">
            <div className="title">
                학교 소식지
            </div>
            <div className="content">
                약간 이쯤에 공모전이나 공지 같은거나 한 두 줄로 띄워도 괜찮을 듯 <br></br>
                이런 식으로
            </div>
        </div>
    </div>
  );
}

export default NoticeSection;