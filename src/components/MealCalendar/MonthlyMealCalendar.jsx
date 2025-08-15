// MonthlyMealCalendar.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import './MealCalendar.css';

function MonthlyMealCalendar({ onDateClick }) {
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

        const list = Array.isArray(res.data) ? res.data : [];

        const byDate = {};
        for (const item of list) {
          const date = item.date;
          if (!date) continue;

          // ⭐ 중식/석식 필드를 구분해서 저장
          if (!byDate[date]) {
            byDate[date] = { lunch: [], dinner: [] };
          }

          if (item.category === '중식') {
            byDate[date].lunch.push(item.dishName);
          } else if (item.category === '석식') {
            byDate[date].dinner.push(item.dishName);
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
      {lunchList.length > 0 && (
        <div className="lunch">
          <strong>[중식]</strong>
          <div>{lunchList.join(', ')}</div>
        </div>
      )}
      {dinnerList.length > 0 && (
        <div className="dinner" style={{ marginTop: '4px' }}>
          <strong>[석식]</strong>
          <div>{dinnerList.join(', ')}</div>
        </div>
      )}
    </div>
  );
};



  const title = useMemo(() => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    return `가락고등학교 ${m}월 급식표`;
  }, [date]);

  return (
    <div style={{ maxWidth: '1280px', margin: 'auto' }}>
      <h2 className="meal-title">{title}</h2>
      {error && <div className="meal-error">{error}</div>}
      {loading && <div className="meal-loading">불러오는 중…</div>}

      <Calendar
        view="month"  // ✅ 추가해줘!
        onClickDay={handleDateClick}
        onActiveStartDateChange={handleActiveStartDateChange}
        value={date}
        tileContent={({ date: tileDate, view }) =>
          view === 'month' ? renderMealPreview(tileDate) : null
        }
      />

    </div>
  );
}

export default MonthlyMealCalendar;
