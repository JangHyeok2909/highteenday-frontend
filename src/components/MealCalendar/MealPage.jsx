import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MonthlyMealCalendar from './MonthlyMealCalendar';
import styles from './MealPage.module.css';
import Header from 'components/Header/MainHader/Header';
import "components/Default.css"


function MealPage() {
  const [schoolName, setSchoolName] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1~12월
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchMealHeader = async () => {
      try {
        const res = await axios.get('/api/schools/meals/month');
        if (res.data && res.data.length > 0) {
          const first = res.data[0];
          setSchoolName(first.schoolName);
          const dateObj = new Date(first.date);
          setMonth(dateObj.getMonth() + 1);
          setYear(dateObj.getFullYear());
        }
      } catch (err) {
        console.error('급식 헤더 데이터 불러오기 실패:', err);
      }
    };

    fetchMealHeader();
  }, []);

  return (
    <div id="TimetablePage" className="default-root-value">
      <div className="content-container">
        <div className="header">
          <Header isMainPage={false} />
        </div>
        <div className={styles.mealPageContainer}>
          <MonthlyMealCalendar onDateClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default MealPage;
