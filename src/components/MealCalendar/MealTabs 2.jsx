import React, { useState, useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import MonthlyMealCalendar from './MonthlyMealCalendar';
import WeeklyMealView from './WeeklyMealView';
import DailyMealView from './DailyMealView';

function MealTabs({ schoolId }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 탭 전환 핸들러
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // ✅ 월별 캘린더에서 날짜 클릭 시 실행될 함수
  const handleDateClickFromMonthly = (date) => {
    setSelectedDate(date);
    setTabIndex(2); // 일별 탭으로 전환
  };

  // ✅ 일별 탭으로 전환되면 selectedDate를 오늘로 초기화
  useEffect(() => {
    if (tabIndex === 2) {
      setSelectedDate(new Date());
    }
  }, [tabIndex]);

  return (
    <div className="p-4">
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="월별" />
        <Tab label="주별" />
        <Tab label="일별" />
      </Tabs>

      <div className="mt-4">
        {tabIndex === 0 && (
          <MonthlyMealCalendar
            schoolId={schoolId}
            onDateClick={handleDateClickFromMonthly}
          />
        )}
        {tabIndex === 1 && (
          <WeeklyMealView
            schoolId={schoolId}
            selectedDate={selectedDate}
          />
        )}
        {tabIndex === 2 && (
          <DailyMealView
            schoolId={schoolId}
            selectedDate={selectedDate}
          />
        )}
      </div>
    </div>
  );
}

export default MealTabs;