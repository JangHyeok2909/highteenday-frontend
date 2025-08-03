import React, { useState } from "react";
import styles from "./TimetableMeal.module.css";

const TimetableMeal = () => {
  const [activeTab, setActiveTab] = useState("시간표");

  // 임시 데이터
  const timetableData = {
    1: "국어",
    2: "수학",
    3: "영어",
    4: "사회",
    5: "과학",
    6: "체육",
    7: "미술",
    8: "자율"
  };

  const mealData = {
    1: "김치볶음밥",
    2: "계란국",
    3: "돈까스",
    4: "샐러드",
    5: "우유",
    6: "",
    7: "",
    8: ""
  };

  // // API 연결용 (현재 미완성)
  // useEffect(() => {
  //   axios.get(`/api/timetable`).then((res) => setTimetableData(res.data));
  // }, []);

  const renderRows = () => {
    const data = activeTab === "시간표" ? timetableData : mealData;
    return Array.from({ length: 8 }, (_, i) => (
        <div
        key={i + 1}
        className={`${styles.row} ${
            activeTab === "급식" ? styles.centered : ""
        }`}
        >
        {activeTab === "시간표" && (
            <span className={styles.period}>{i + 1}교시</span>
        )}
        <span className={styles.content}>
            {data[i + 1] || (activeTab === "급식" ? "" : "-")}
        </span>
        </div>
        ));
    };



  return (
    <div className={styles.container}>
      <div className={styles.tabMenu}>
        <div
          className={`${styles.tab} ${
            activeTab === "시간표" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("시간표")}
        >
          시간표
        </div>
        <div
          className={`${styles.tab} ${
            activeTab === "급식" ? styles.active : ""
          }`}
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
