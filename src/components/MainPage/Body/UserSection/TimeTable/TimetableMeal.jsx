import React, { useState, useEffect } from "react";
import styles from "./TimetableMeal.css";
import axios from "axios";
import "../../../../Default.css"


const TimetableMeal = () => {
  const [activeTab, setActiveTab] = useState("시간표");
  const [timetableData, setTimetableData] = useState([]);
  const [mealData, setMealData] = useState([]);

  // ✅ 시간표 불러오기
  useEffect(() => {
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
  }, []);

  // ✅ 급식 불러오기 (탭 클릭 시 실행)
  useEffect(() => {
    if (activeTab === "급식") {
      axios
        .get("/api/schools/meals/today", {
          withCredentials: true
        })
        .then((res) => {
          const mealArr = res.data.map((item) => item.dishName);
          const paddedMealArr = [...mealArr.slice(0, 8), ...Array(8).fill("")].slice(0, 8); // 8칸 고정
          setMealData(paddedMealArr);
        })
        .catch((err) => {
          console.error("급식 불러오기 실패:", err);
        });
    }
  }, [activeTab]);

  const renderRows = () => {
    const data = activeTab === "시간표" ? timetableData : mealData;
  
    return Array.from({ length: 8 }, (_, i) => (
      <div
        key={i + 1}
        className={`row ${activeTab === "급식" ? "centered" : ""}`}
      >
        {activeTab === "시간표" && (
          <span className="period">{i + 1}교시</span>
        )}
        <span className="content">
          {data[i + 1] || (activeTab === "급식" ? data[i] || "" : "-")}
        </span>
      </div>
    ));
  };
  
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
  
        <div className="contentBox">{renderRows()}</div>
      </div>
    </div>
  );  
};

export default TimetableMeal;
