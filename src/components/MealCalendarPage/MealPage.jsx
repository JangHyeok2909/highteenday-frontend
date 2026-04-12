import React from 'react';
import MonthlyMealCalendar from './MonthlyMealCalendar';
import styles from './MealPage.module.css';
import Header from 'components/Header/MainHader/Header';
import "components/Default.css"


function MealPage() {

  return (
    <div id="TimetablePage" className="default-root-value">
      <div className="content-container">
        <div className="header">
          <Header isMainPage={false} />
        </div>
        <div className={styles.mealPageContainer}>
          <MonthlyMealCalendar onDateClick={() => {}} />
        </div>
      </div>
    </div>
  );
}

export default MealPage;
