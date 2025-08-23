// MonthlyMealCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './MealCalendar.css';



function MonthlyMealCalendar({ onDateClick }) {
  const [schoolName,setSchoolName] = useState("");

  const [date, setDate] = useState(new Date());
  const [currentMonthKey, setCurrentMonthKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [mealMap, setMealMap] = useState({}); // 날짜별 중식/석식 객체
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    console.log('mealMap 확인:', mealMap);
  }, [mealMap]);

  useEffect(() => {
    let cancelled = false;

    async function fetchMeals() {
      setLoading(true);
      setError('');

      try {
        const res = await axios.get('/api/schools/meals/month', {
          headers: { Accept: 'application/json' },
        });

        console.log("✅ res.data 응답 확인용 로그:", res.data);
        setSchoolName(res.data.schoolName);
        const list = Array.isArray(res.data.mealdtos) ? res.data.mealdtos : [];

        const byDate = {};
        for (const item of list) {

          console.log(`date: ${item.date}, category: "${item.category}", dishName: "${item.dishName}"`);

          const dateKey = toYMD(new Date(item.date));
          if (!dateKey) continue;

          if (!byDate[dateKey]) {
            byDate[dateKey] = { lunch: [], dinner: [] };
          }

          // ✅ API category 값(lunch/dinner)에 맞춰서 조건 수정
          if (item.category?.toLowerCase() === 'lunch') {
            byDate[dateKey].lunch.push(item.dishName);
          } else if (item.category?.toLowerCase() === 'dinner') {
            byDate[dateKey].dinner.push(item.dishName);
          }
        }

        if (!cancelled) setMealMap(byDate);
      } catch (e) {
        if (!cancelled) {
          setError('급식 정보를 불러오지 못했어요.');
          console.error(e);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMeals();
    return () => {
      cancelled = true;
    };
  }, [currentMonthKey]);

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    if (onDateClick) {
      const key = toYMD(clickedDate);
      onDateClick(clickedDate, mealMap[key] || {});
    }
  };

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view !== 'month' || !activeStartDate) return;
    const y = activeStartDate.getFullYear();
    const m = String(activeStartDate.getMonth() + 1).padStart(2, '0');
    const nextKey = `${y}-${m}`;
    if (nextKey !== currentMonthKey) {
      setCurrentMonthKey(nextKey);
    }
  };

  const renderMealPreview = (day) => {
    const key = toYMD(day);
    const meals = mealMap[key];
  
    if (!meals || (!meals.lunch?.length && !meals.dinner?.length)) {
      return <div className="meal-preview">급식 없음</div>;
    }
  
    const lunchList = Array.isArray(meals.lunch) ? meals.lunch : [];
    const dinnerList = Array.isArray(meals.dinner) ? meals.dinner : [];
  
    return (
      <div className="meal-preview">
        {/* 중식 */}
        {lunchList.length > 0 && (
          <div className="lunch">
            <strong>[중식]</strong>
            <div className="meal-text">
              {lunchList.flatMap(item =>
                item.split(',').map((dish, idx) => (
                  <span key={idx} className="meal-line">{dish.trim()}</span>  // ✅ split 적용
                ))
              )}
            </div>
          </div>
        )}
  
        {/* 석식 */}
        {dinnerList.length > 0 && (
          <div className="dinner" style={{ marginTop: '4px' }}>
            <strong>[석식]</strong>
            <div className="meal-text">
              {dinnerList.flatMap(item =>
                item.split(',').map((dish, idx) => (
                  <span key={idx} className="meal-line">{dish.trim()}</span>  // ✅ split 적용
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  
  
  
  


  const title = useMemo(() => {
    const m = date.getMonth() + 1;
    return `${schoolName} ${m}월 급식표`;
  }, [date,schoolName]);

  return (
  <div className="meal-calendar-container">
    <h2 className="meal-title">{title}</h2>
    {error && <div className="meal-error">{error}</div>}
    {loading && <div className="meal-loading">불러오는 중…</div>}

    <Calendar
      view="month"
      onClickDay={handleDateClick}
      onActiveStartDateChange={handleActiveStartDateChange}
      value={date}
      showNavigation={false} 
      tileContent={({ date: tileDate, view }) =>
        view === 'month' ? renderMealPreview(tileDate) : null
      }
    />
  </div>
);

}

export default MonthlyMealCalendar;
