import React from 'react';
import MealTabs from '../components/MealCalendar/MealTabs';

function MealPage() {
  const schoolId = 1;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">급식표</h2>
      <MealTabs schoolId={schoolId} />
    </div>
  );
}

export default MealPage; // ✅ 반드시 default export!
