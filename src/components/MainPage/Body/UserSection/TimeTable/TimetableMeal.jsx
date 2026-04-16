import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TimetableMeal.css";
import axios from "axios";
import "../../../../Default.css";
import { useAuth } from "../../../../../contexts/AuthContext";

const TimetableMeal = () => {
  const navigate = useNavigate();
  const { isLogin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("시간표");
  const [timetableData, setTimetableData] = useState([]);
  const [mealData, setMealData] = useState([]);

  const handleContentClick = () => {
    if (activeTab === "시간표") {
      navigate("/timetable");
    } else {
      navigate("/meal");
    }
  };

  // 시간표 불러오기 — 로그인 상태일 때만
  useEffect(() => {
    if (!isLogin) return;
    axios
      .get("/api/timetableTemplates/userTimetables/today", {
        withCredentials: true
      })
      .then((res) => {
        const timetableArr = Array(9).fill(null);
        res.data.forEach((item) => {
          const period = parseInt(item.period, 10);
          const subject = item.subjectDto?.subjectName || "";
          if (period >= 1 && period <= 8) {
            timetableArr[period] = subject;
          }
        });
        setTimetableData(timetableArr);
      })
      .catch((err) => {
        console.error("시간표 불러오기 실패:", err);
      });
  }, [isLogin]);

  // 급식 불러오기 — 로그인 상태이고 급식 탭일 때만
  useEffect(() => {
    if (!isLogin || activeTab !== "급식") return;
    axios
      .get("/api/schools/meals/today", {
        withCredentials: true
      })
      .then((res) => {
        const mealArr = res.data.map((item) => item.dishName);
        const paddedMealArr = [...mealArr.slice(0, 8), ...Array(8).fill("")].slice(0, 8);
        setMealData(paddedMealArr);
      })
      .catch((err) => {
        console.error("급식 불러오기 실패:", err);
      });
  }, [isLogin, activeTab]);

  const renderTimetableRows = () => {
    return Array.from({ length: 8 }, (_, i) => {
      const text = timetableData[i + 1] || "-";
      return (
        <div key={i + 1} className="row">
          <span className="period">{i + 1}교시</span>
          <span
            className="content content-clickable"
            onClick={handleContentClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleContentClick();
              }
            }}
          >
            {text}
          </span>
        </div>
      );
    });
  };

  // "밥,국,생선" 형태를 쉼표 기준으로 나누어 세로 목록으로 표시
  const mealItems = mealData.flatMap((item) =>
    item
      ? String(item)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );

  const renderMealContent = () => (
    <div
      className="meal-box"
      onClick={handleContentClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleContentClick();
        }
      }}
    >
      <div className="meal-label">오늘의 급식</div>
      {mealItems.length > 0 ? (
        <div className="meal-list">
          {mealItems.map((name, idx) => (
            <div key={idx} className="meal-row">
              {name}
            </div>
          ))}
        </div>
      ) : (
        <p className="meal-empty">급식 정보가 없습니다</p>
      )}
      <span className="meal-more">자세히 보기 →</span>
    </div>
  );

  const renderLoginRequired = () => (
    <div
      className="login-required-box"
      onClick={() => navigate("/login")}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") navigate("/login"); }}
    >
      <p className="login-required-text">로그인이 필요한 서비스입니다.</p>
      <span className="login-required-link">로그인하러 가기 →</span>
    </div>
  );

  // 초기 로딩 중이면 아무것도 렌더링하지 않음
  if (isLoading) return null;

  return (
    <div id="time-table">
      <div className="container">
        <div className="tabMenu">
          <div
            className={`tab ${activeTab === "시간표" ? "active_right" : ""}`}
            onClick={() => setActiveTab("시간표")}
          >
            시간표
          </div>
          <div
            className={`tab ${activeTab === "급식" ? "active_left" : ""}`}
            onClick={() => setActiveTab("급식")}
          >
            급식
          </div>
        </div>

        <div className={`contentBox ${!isLogin ? "contentBox--center" : activeTab === "급식" ? "contentBox--meal" : ""}`}>
          {!isLogin
            ? renderLoginRequired()
            : activeTab === "시간표"
            ? renderTimetableRows()
            : renderMealContent()}
        </div>
      </div>
    </div>
  );
};

export default TimetableMeal;
