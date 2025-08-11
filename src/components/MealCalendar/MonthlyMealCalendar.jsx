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
  const [mealsMap, setMealsMap] = useState({}); // { '2025-08-11': [{...}, ...] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // YYYY-MM-DD 문자열로 포맷
  const toYMD = (d) => d.toISOString().split('T')[0];

  // 월이 바뀔 때 서버에서 급식 가져오기
  useEffect(() => {
    let cancelled = false;

    async function fetchMeals() {
      setLoading(true);
      setError('');
      try {
        // 스웨거 상 "No parameters" 라서 기본 엔드포인트로 요청
        // (만약 백엔드가 year/month 쿼리를 요구한다면 ?year=YYYY&month=MM 붙이면 됨)
        const res = await axios.get('/api/schools/meals/month', {
          headers: { Accept: 'application/json' },
        });

        const list = Array.isArray(res.data) ? res.data : [];
        // 배열을 날짜별로 그룹핑
        const byDate = {};
        for (const item of list) {
          const key = item.date; // 예: '2025-08-11'
          if (!key) continue;
          if (!byDate[key]) byDate[key] = [];
          byDate[key].push(item);
        }
        if (!cancelled) setMealsMap(byDate);
      } catch (e) {
        if (!cancelled) setError('급식 정보를 불러오지 못했어요.');
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMeals();
    return () => {
      cancelled = true;
    };
  }, [currentMonthKey]);

  // 달력에서 일 클릭
  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    if (onDateClick) {
      const key = toYMD(clickedDate);
      onDateClick(clickedDate, mealsMap[key] || []);
    }
  };

  // 달력이 다른 달로 이동할 때 (월 시작 날짜 기준)
  const handleActiveStartDateChange = ({ activeStartDate, view }) => {
    if (view !== 'month' || !activeStartDate) return;
    const y = activeStartDate.getFullYear();
    const m = String(activeStartDate.getMonth() + 1).padStart(2, '0');
    const nextKey = `${y}-${m}`;
    if (nextKey !== currentMonthKey) {
      setCurrentMonthKey(nextKey);
    }
  };

  // 날짜 타일에 들어갈 미리보기 (첫 메뉴만 간단히)
  const renderMealPreview = (day) => {
    const key = toYMD(day);
    const meals = mealsMap[key];
    const firstName = meals?.[0]?.dishName;
    return (
      <div className="meal-preview">
        {firstName || '급식 없음'}
      </div>
    );
  };

  // 상단 제목 등에 쓰려면 여기서 메모이즈 가능
  const title = useMemo(() => {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    return `우리학교 ${m}월 급식표`;
  }, [date]);

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      {/* 필요하면 제목 표시 */}
      {/* <h2 className="meal-title">{title}</h2> */}
      {error && <div className="meal-error">{error}</div>}
      {loading && <div className="meal-loading">불러오는 중…</div>}

      <Calendar
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
