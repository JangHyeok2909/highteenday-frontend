import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './MealCalendar.css';

function MonthlyMealCalendar({ onDateClick }) {
  const [date, setDate] = useState(new Date());

  // ✅ 임시 급식 데이터 (서버 연결 전용)
  const meals = [
    { date: '2025-08-07', dishName: '된장찌개' },
    { date: '2025-08-14', dishName: '김치볶음밥' },
    { date: '2025-08-21', dishName: '불고기' },
    { date: '2025-08-28', dishName: '비빔밥' },
  ];

  // ✅ 날짜 클릭 시 호출
  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    if (onDateClick) onDateClick(clickedDate);
  };

  // ✅ 급식 미리보기 렌더링
  const getMealPreview = (day) => {
    const yyyyMMdd = day.toISOString().split('T')[0];
    const meal = meals.find((m) => m.date === yyyyMMdd);

    console.log('📅 급식 매칭:', yyyyMMdd, '➡️', meal?.dishName);

    return (
      <div className="meal-preview">
        {meal?.dishName || '급식 없음'}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Calendar
        onClickDay={handleDateClick}
        value={date}
        tileContent={({ date: tileDate, view }) =>
          view === 'month' ? getMealPreview(tileDate) : null
        }
      />
    </div>
  );
}

export default MonthlyMealCalendar;
