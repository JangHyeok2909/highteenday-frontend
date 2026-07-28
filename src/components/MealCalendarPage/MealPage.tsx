import React from "react";
import { Helmet } from "react-helmet-async";
import MonthlyMealCalendar from "./MonthlyMealCalendar";
import styles from "./MealPage.module.css";

function MealPage() {
  return (
    <div className="meal-page default-root-value">
      <Helmet>
        <title>급식 | 하이틴데이</title>
      </Helmet>
      <div className={styles.mealPageContainer}>
        <MonthlyMealCalendar />
      </div>
    </div>
  );
}

export default MealPage;
