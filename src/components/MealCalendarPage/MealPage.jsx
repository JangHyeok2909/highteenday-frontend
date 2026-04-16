import React from 'react';
import { Helmet } from 'react-helmet-async';
import MonthlyMealCalendar from './MonthlyMealCalendar';
import styles from './MealPage.module.css';
import Header from 'components/Header/MainHader/Header';
import "components/Default.css"


function MealPage() {

  return (
    <div id="TimetablePage" className="default-root-value">
      <Helmet><title>급식 | 하이틴데이</title></Helmet>
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
