import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WeeklyMealView({ schoolId }) {
  const [meals, setMeals] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const fetchWeeklyMeals = async () => {
      const yyyyMmDd = selectedDate.toISOString().split('T')[0];
      try {
        const res = await axios.get('/api/school/meal/week', {
          params: {
            date: yyyyMmDd,
            schoolId: schoolId,
          },
        });
        setMeals(res.data);
      } catch (err) {
        console.error('주간 급식 데이터를 불러오는 데 실패했습니다.', err);
      }
    };

    fetchWeeklyMeals();
  }, [selectedDate, schoolId]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  return (
    <div>
      <label>기준 날짜 선택: </label>
      <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={handleDateChange} />

      <ul className="mt-4">
        {meals.length > 0 ? (
          meals.map((meal, idx) => (
            <li key={idx} className="border p-2 mb-2">
              <strong>{meal.date}</strong>: {meal.dishName} ({meal.category}) - {meal.calorie} kcal
            </li>
          ))
        ) : (
          <p>해당 주에 대한 급식 정보가 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default WeeklyMealView;