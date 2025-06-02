import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../MealCalendar/MealCalendar.css';

function MonthlyMealCalendar({ schoolId, onDateClick }) {
  const [meals, setMeals] = useState([]);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchMonthlyMeals = async () => {
      const yyyyMmDd = date.toISOString().split('T')[0];
      try {
        const res = await axios.get('/api/school/meal/month', {
          params: {
            date: yyyyMmDd,
            schoolId: schoolId,
          },
        });
        setMeals(res.data);
      } catch (err) {
        console.error('급식 데이터를 불러오지 못했습니다.', err);
      }
    };

    fetchMonthlyMeals();
  }, [date, schoolId]);

  const getMealPreview = (day) => {
    const yyyyMmDd = day.toISOString().split('T')[0];
    const meal = meals.find((m) => m.date === yyyyMmDd);
    return meal ? (
      <div className="meal-preview">{meal.dishName.slice(0, 10)}...</div>
    ) : null;
  };

  const handleDateClick = (clickedDate) => {
    setDate(clickedDate);
    if (onDateClick) {
      onDateClick(clickedDate); // 👉 부모(MealTabs)에서 전달받은 날짜 클릭 핸들러 호출
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Calendar
        onClickDay={handleDateClick} // ✅ 변경됨: onChange → onClickDay
        value={date}
        tileContent={({ date, view }) =>
          view === 'month' ? getMealPreview(date) : null
        }
      />
    </div>
  );
}

export default MonthlyMealCalendar;
