import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Card } from "../../../../ui";
import "./TimetableMeal.css";

interface TodayTimetableItem {
  period: number | string;
  subjectDto?: { subjectName?: string } | null;
}

interface TodayMealItem {
  dishName: string;
}

type TabKey = "시간표" | "급식";

const TimetableMeal = () => {
  const navigate = useNavigate();
  const { isLogin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>("시간표");
  const [timetableData, setTimetableData] = useState<(string | null)[]>([]);
  const [mealData, setMealData] = useState<string[]>([]);

  const handleContentClick = () => {
    navigate(activeTab === "시간표" ? "/timetable" : "/meal");
  };

  // 시간표 불러오기 — 로그인 상태일 때만
  useEffect(() => {
    if (!isLogin) return;
    axios
      .get<TodayTimetableItem[]>("/api/timetableTemplates/userTimetables/today", {
        withCredentials: true,
      })
      .then((res) => {
        const timetableArr: (string | null)[] = Array(9).fill(null);
        res.data.forEach((item) => {
          const period = parseInt(String(item.period), 10);
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
      .get<TodayMealItem[]>("/api/schools/meals/today", {
        withCredentials: true,
      })
      .then((res) => {
        const mealArr = res.data.map((item) => item.dishName);
        setMealData(mealArr.slice(0, 8));
      })
      .catch((err) => {
        console.error("급식 불러오기 실패:", err);
      });
  }, [isLogin, activeTab]);

  // "밥,국,생선" 형태를 쉼표 기준으로 나누어 세로 목록으로 표시
  const mealItems = mealData.flatMap((item) =>
    item
      ? String(item)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : []
  );

  if (isLoading) return null;

  return (
    <Card className="tt-meal" flush>
      <div className="tt-meal__tabs" role="tablist">
        {(["시간표", "급식"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`tt-meal__tab ${
              activeTab === tab ? "tt-meal__tab--active" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tt-meal__body">
        {!isLogin ? (
          <button
            type="button"
            className="tt-meal__login"
            onClick={() => navigate("/login")}
          >
            <p>로그인이 필요한 서비스입니다.</p>
            <span>로그인하러 가기 →</span>
          </button>
        ) : activeTab === "시간표" ? (
          <div className="tt-meal__grid" onClick={handleContentClick}>
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i + 1} className="tt-meal__row">
                <span className="tt-meal__period">{i + 1}교시</span>
                <span className="tt-meal__subject">
                  {timetableData[i + 1] || "-"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="tt-meal__meal" onClick={handleContentClick}>
            <div className="tt-meal__meal-label">오늘의 급식</div>
            {mealItems.length > 0 ? (
              <ul className="tt-meal__meal-list">
                {mealItems.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            ) : (
              <p className="tt-meal__meal-empty">급식 정보가 없습니다</p>
            )}
            <span className="tt-meal__more">자세히 보기 →</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TimetableMeal;
