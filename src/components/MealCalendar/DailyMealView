import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ 날짜를 KST 기준으로 보정하여 yyyy-MM-dd 형식으로 반환
const formatDateToYyyyMmDd = (date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().split('T')[0];
};

function DailyMealView({ schoolId, selectedDate }) {
  const [meal, setMeal] = useState(null);

  const fetchDailyMeal = async () => {
    const yyyyMmDd = formatDateToYyyyMmDd(selectedDate);
    try {
      const res = await axios.get('/api/school/meal/date', {
        params: {
          date: yyyyMmDd,
          schoolId: schoolId,
        },
      });
      if (res.data.length > 0) {
        setMeal(res.data[0]);
      } else {
        setMeal(null);
      }
    } catch (err) {
      console.error('일별 급식 데이터를 불러오는 데 실패했습니다.', err);
    }
  };

  useEffect(() => {
    fetchDailyMeal();
  }, [selectedDate, schoolId]);

  return (
    <div className="p-4">
      {meal ? (
        <div className="ml-4">
          <p className="text-lg font-semibold mb-1">📅 <strong>{meal.date}</strong></p>
          <p className="text-base mb-1">🍽 {meal.category}</p>
          <p className="text-base mb-1">{meal.dishName}</p>
          <p className="text-sm text-gray-600">🔥 {meal.calorie} kcal</p>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">해당 날짜의 급식 정보가 없습니다.</p>
      )}
    </div>
  );
}

export default DailyMealView;