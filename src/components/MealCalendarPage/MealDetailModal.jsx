import React, { useEffect } from 'react';
import './MealDetailModal.css';

function MealDetailModal({ dateLabel, meal, onClose }) {
  const lunchList = meal?.lunch ?? [];
  const dinnerList = meal?.dinner ?? [];

  const lunchCalorie = lunchList.reduce((sum, item) => sum + (item.calorie ?? 0), 0);
  const dinnerCalorie = dinnerList.reduce((sum, item) => sum + (item.calorie ?? 0), 0);
  const totalCalorie = lunchCalorie + dinnerCalorie;

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="meal-modal-overlay" onClick={onClose}>
      <div className="meal-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="meal-modal-header">
          <span className="meal-modal-date">{dateLabel}</span>
          <button className="meal-modal-close" onClick={onClose} aria-label="닫기">✕</button>
        </div>

        {/* 본문 */}
        <div className="meal-modal-body">
          {lunchList.length === 0 && dinnerList.length === 0 ? (
            <p className="meal-modal-empty">급식 정보가 없습니다.</p>
          ) : (
            <>
              {/* 중식 */}
              {lunchList.length > 0 && (
                <section className="meal-modal-section">
                  <div className="meal-modal-category lunch">🍱 중식</div>
                  <ul className="meal-modal-list">
                    {lunchList.flatMap((item, i) =>
                      item.dishName.split(',').map((dish, idx) => (
                        <li key={`lunch-${i}-${idx}`}>{dish.trim()}</li>
                      ))
                    )}
                  </ul>
                  {lunchCalorie > 0 && (
                    <p className="meal-modal-cal-sub">🔥 {lunchCalorie.toLocaleString()} kcal</p>
                  )}
                </section>
              )}

              {/* 석식 */}
              {dinnerList.length > 0 && (
                <section className="meal-modal-section">
                  <div className="meal-modal-category dinner">🍽 석식</div>
                  <ul className="meal-modal-list">
                    {dinnerList.flatMap((item, i) =>
                      item.dishName.split(',').map((dish, idx) => (
                        <li key={`dinner-${i}-${idx}`}>{dish.trim()}</li>
                      ))
                    )}
                  </ul>
                  {dinnerCalorie > 0 && (
                    <p className="meal-modal-cal-sub">🔥 {dinnerCalorie.toLocaleString()} kcal</p>
                  )}
                </section>
              )}
            </>
          )}
        </div>

        {/* 푸터 — 총 칼로리 */}
        {totalCalorie > 0 && (
          <div className="meal-modal-footer">
            <span>하루 총 칼로리</span>
            <strong>{totalCalorie.toLocaleString()} kcal</strong>
          </div>
        )}
      </div>
    </div>
  );
}

export default MealDetailModal;
