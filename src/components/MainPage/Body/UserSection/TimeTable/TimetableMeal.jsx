import React, { useState, useEffect } from "react";
import styles from "./TimetableMeal.module.css";
import axios from "axios";
import "../../../../Default.css"


const TimetableMeal = () => {
  const [activeTab, setActiveTab] = useState("시간표");
  const [timetableData, setTimetableData] = useState([]);
  const [mealData, setMealData] = useState([]);

  // ✅ 시간표 불러오기
  useEffect(() => {
    axios
      .get("/api/timetableTemplates/userTimetables/today")
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
        .get("/api/schools/meals/today")
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
        className={`${styles.row} ${activeTab === "급식" ? styles.centered : ""}`}
      >
        {activeTab === "시간표" && (
          <span className={styles.period}>{i + 1}교시</span>
        )}
        <span className={styles.content}>
          {data[i + 1] || (activeTab === "급식" ? data[i] || "" : "-")}
        </span>
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabMenu}>
        <div
          className={`${styles.tab} ${activeTab === "시간표" ? styles.active : ""}`}
          onClick={() => setActiveTab("시간표")}
        >
          시간표
        </div>
        <div
          className={`${styles.tab} ${activeTab === "급식" ? styles.active : ""}`}
          onClick={() => setActiveTab("급식")}
        >
          급식
        </div>
      </div>

      <div className={styles.contentBox}>{renderRows()}</div>
    </div>
  );
};

export default TimetableMeal;
