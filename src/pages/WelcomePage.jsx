import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";

const SERVICES = [
  { icon: "📋", title: "자유 게시판", desc: "친구들과 자유롭게 이야기를 나눠보세요." },
  { icon: "📚", title: "수능·계열 게시판", desc: "수능, 이과, 문과 게시판에서 정보를 공유하세요." },
  { icon: "🕐", title: "시간표 관리", desc: "나만의 수업 시간표를 한눈에 관리하세요." },
  { icon: "🍱", title: "급식 정보", desc: "오늘의 학교 급식 메뉴를 확인하세요." },
  { icon: "👥", title: "친구 기능", desc: "같은 학교 친구들을 추가하고 소통하세요." },
  { icon: "🔖", title: "스크랩", desc: "마음에 드는 게시글을 저장해두세요." },
];

const TICKER_ITEMS = [
  "게시판", "시간표", "급식 정보", "친구 추가", "스크랩", "익명 게시", "댓글", "좋아요",
  "게시판", "시간표", "급식 정보", "친구 추가", "스크랩", "익명 게시", "댓글", "좋아요",
];

function WelcomePage() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    SERVICES.forEach((_, i) => {
      setTimeout(() => {
        setVisible((prev) => [...prev, i]);
      }, 800 + i * 300);
    });
  }, []);

  return (
    <div className="welcome-page">
      <div className="welcome-hero">
        <div className="welcome-logo-ring" />
        <h1 className="welcome-title">
          <span className="welcome-title-highlight">하이틴데이</span>에
          <br />
          오신 것을 환영합니다!
        </h1>
        <p className="welcome-sub">고등학생을 위한 모든 것이 여기에 있어요.</p>
      </div>

      <div className="ticker-wrapper">
        <div className="ticker-track">
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <span className="ticker-dot">·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="welcome-services-label">하이틴데이의 서비스</div>

      <div className="welcome-cards">
        {SERVICES.map((s, i) => (
          <div
            key={i}
            className={`welcome-card ${visible.includes(i) ? "visible" : ""}`}
            style={{ transitionDelay: `${i * 60}ms` }}
          >
            <div className="card-icon">{s.icon}</div>
            <div className="card-text">
              <div className="card-title">{s.title}</div>
              <div className="card-desc">{s.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="welcome-footer">
        <button className="welcome-start-btn" onClick={() => navigate("/")}>
          시작하기
        </button>
      </div>
    </div>
  );
}

export default WelcomePage;
