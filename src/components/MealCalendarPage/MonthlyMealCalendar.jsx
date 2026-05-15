// MonthlyMealCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Calendar from "react-calendar";
import axios from 'axios';
import './MealCalendar.css';
import MealDetailModal from './MealDetailModal';

function MonthlyMealCalendar({ onDateClick }) {
  const [schoolName, setSchoolName] = useState("");
  const [date, setDate] = useState(new Date());
  const [currentMonthKey, setCurrentMonthKey] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [mealMap, setMealMap] = useState({}); // { 'yyyy-MM-dd': { lunch: [{dishName, calorie}], dinner: [...] } }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalInfo, setModalInfo] = useState(null); // { dateLabel, meal }

  const toYMD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchMeals() {
      setLoading(true);
      setError('');

      try {
        const res = await axios.get('/api/schools/meals/month', {
          headers: { Accept: 'application/json' },
          withCredentials: true,
        });

        setSchoolName(res.data.schoolName);
        const list = Array.isArray(res.data.mealdtos) ? res.data.mealdtos : [];

        const byDate = {};
        for (const item of list) {
          const dateKey = toYMD(new Date(item.date));
          if (!dateKey) continue;

          if (!byDate[dateKey]) {
            byDate[dateKey] = { lunch: [], dinner: [] };
          }

          const entry = { dishName: item.dishName, calorie: item.calorie ?? 0 };

          if (item.category?.toLowerCase() === 'lunch') {
            byDate[dateKey].lunch.push(entry);
          } else if (item.category?.toLowerCase() === 'dinner') {
            byDate[dateKey].dinner.push(entry);
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
    return () => { cancelled = true; };
  }, [currentMonthKey]);

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    const key = toYMD(clickedDate);
    const meal = mealMap[key] || { lunch: [], dinner: [] };

    // 팝업 열기
    const y = clickedDate.getFullYear();
    const m = clickedDate.getMonth() + 1;
    const d = clickedDate.getDate();
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const dayName = dayNames[clickedDate.getDay()];
    setModalInfo({ dateLabel: `${y}년 ${m}월 ${d}일 (${dayName})`, meal });

    if (onDateClick) onDateClick(clickedDate, meal);
  };

  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view !== 'month' || !activeStartDate) return;
    const y = activeStartDate.getFullYear();
    const m = String(activeStartDate.getMonth() + 1).padStart(2, '0');
    const nextKey = `${y}-${m}`;
    if (nextKey !== currentMonthKey) setCurrentMonthKey(nextKey);
  };

  const renderMealPreview = (day) => {
    const key = toYMD(day);
    const meals = mealMap[key];

    if (!meals || (!meals.lunch?.length && !meals.dinner?.length)) {
      return <div className="meal-preview no-meal">급식 없음</div>;
    }

    const lunchList = Array.isArray(meals.lunch) ? meals.lunch : [];
    const dinnerList = Array.isArray(meals.dinner) ? meals.dinner : [];

    return (
      <div className="meal-preview">
        {lunchList.length > 0 && (
          <div className="lunch">
            <strong>[중식]</strong>
            <div className="meal-text">
              {lunchList.flatMap((item, i) =>
                item.dishName.split(',').map((dish, idx) => (
                  <span key={`l-${i}-${idx}`} className="meal-line">{dish.trim()}</span>
                ))
              )}
            </div>
          </div>
        )}

        {dinnerList.length > 0 && (
          <div className="dinner">
            <strong>[석식]</strong>
            <div className="meal-text">
              {dinnerList.flatMap((item, i) =>
                item.dishName.split(',').map((dish, idx) => (
                  <span key={`d-${i}-${idx}`} className="meal-line">{dish.trim()}</span>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const title = useMemo(() => {
    const m = parseInt(currentMonthKey.split('-')[1]);
    return `${schoolName} ${m}월 급식표`;
  }, [currentMonthKey, schoolName]);

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
        tileContent={({ date: tileDate, view }) =>
          view === 'month' ? renderMealPreview(tileDate) : null
        }
        tileClassName={({ date: tileDate, view }) => {
          if (view !== 'month') return null;
          const day = tileDate.getDay();
          if (day === 0) return 'sunday-tile';
          if (day === 6) return 'saturday-tile';
          return null;
        }}
      />

      {modalInfo && (
        <MealDetailModal
          dateLabel={modalInfo.dateLabel}
          meal={modalInfo.meal}
          onClose={() => setModalInfo(null)}
        />
      )}
    </div>
  );
}

export default MonthlyMealCalendar;
