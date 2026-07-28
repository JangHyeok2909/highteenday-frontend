import React from "react";
import { Modal } from "../ui";
import type { DayMeals } from "./MonthlyMealCalendar";
import "./MealDetailModal.css";

interface MealDetailModalProps {
  dateLabel: string;
  meal: DayMeals | null;
  onClose: () => void;
}

function MealDetailModal({ dateLabel, meal, onClose }: MealDetailModalProps) {
  const lunchList = meal?.lunch ?? [];
  const dinnerList = meal?.dinner ?? [];

  const lunchCalorie = lunchList.reduce(
    (sum, item) => sum + (item.calorie ?? 0),
    0
  );
  const dinnerCalorie = dinnerList.reduce(
    (sum, item) => sum + (item.calorie ?? 0),
    0
  );
  const totalCalorie = lunchCalorie + dinnerCalorie;

  return (
    <Modal isOpen onClose={onClose} title={dateLabel} width={400}>
      <div className="meal-modal__body">
        {lunchList.length === 0 && dinnerList.length === 0 ? (
          <p className="meal-modal__empty">급식 정보가 없습니다.</p>
        ) : (
          <>
            {lunchList.length > 0 && (
              <section className="meal-modal__section">
                <div className="meal-modal__category">🍱 중식</div>
                <ul className="meal-modal__list">
                  {lunchList.flatMap((item, i) =>
                    item.dishName
                      .split(",")
                      .map((dish, idx) => (
                        <li key={`lunch-${i}-${idx}`}>{dish.trim()}</li>
                      ))
                  )}
                </ul>
                {lunchCalorie > 0 && (
                  <p className="meal-modal__cal">
                    🔥 {lunchCalorie.toLocaleString()} kcal
                  </p>
                )}
              </section>
            )}

            {dinnerList.length > 0 && (
              <section className="meal-modal__section">
                <div className="meal-modal__category">🍽 석식</div>
                <ul className="meal-modal__list">
                  {dinnerList.flatMap((item, i) =>
                    item.dishName
                      .split(",")
                      .map((dish, idx) => (
                        <li key={`dinner-${i}-${idx}`}>{dish.trim()}</li>
                      ))
                  )}
                </ul>
                {dinnerCalorie > 0 && (
                  <p className="meal-modal__cal">
                    🔥 {dinnerCalorie.toLocaleString()} kcal
                  </p>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {totalCalorie > 0 && (
        <div className="meal-modal__footer">
          <span>하루 총 칼로리</span>
          <strong>{totalCalorie.toLocaleString()} kcal</strong>
        </div>
      )}
    </Modal>
  );
}

export default MealDetailModal;
