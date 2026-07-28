import React from "react";
import { DAYS, DAY_LABELS, PERIODS, SelectedCell, TimetableEntry } from "./types";
import "./TimetablePage.css";

interface TimetableGridProps {
  timetableData?: TimetableEntry[];
  isEditMode?: boolean;
  onCellClick?: (day: string, period: number) => void;
  selectedCell?: SelectedCell;
}

export default function TimetableGrid({
  timetableData = [],
  isEditMode = false,
  onCellClick,
  selectedCell,
}: TimetableGridProps) {
  const findSubject = (day: string, period: number) => {
    return timetableData.find(
      (entry) => entry.day === day && entry.period === String(period)
    );
  };

  const handleCellClick = (day: string, period: number) => {
    if (isEditMode && onCellClick) {
      onCellClick(day, period);
    }
  };

  const isCellSelected = (day: string, period: number) => {
    return (
      !!selectedCell &&
      selectedCell.day === day &&
      selectedCell.period === period
    );
  };

  return (
    <div className="tt-grid-wrap">
      <table className="tt-grid">
        <thead>
          <tr>
            <th className="tt-grid__period-head">교시</th>
            {DAYS.map((day) => (
              <th key={day}>{DAY_LABELS[day]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => (
            <tr key={period}>
              <td className="tt-grid__period">{period}</td>
              {DAYS.map((day) => {
                const subject = findSubject(day, period);
                const isSelected = isCellSelected(day, period);

                return (
                  <td
                    key={day}
                    onClick={() => handleCellClick(day, period)}
                    className={[
                      "tt-grid__cell",
                      isEditMode ? "tt-grid__cell--editable" : "",
                      isSelected ? "tt-grid__cell--selected" : "",
                      subject ? "tt-grid__cell--filled" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {subject ? (
                      <div className="tt-grid__subject">
                        {subject.subjectDto
                          ? subject.subjectDto.subjectName
                          : "과목명 없음"}
                        {isEditMode && (
                          <span className="tt-grid__remove-mark">×</span>
                        )}
                      </div>
                    ) : isEditMode ? (
                      <span className="tt-grid__plus">＋</span>
                    ) : null}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {isEditMode && (
        <div className="tt-grid__hint">
          💡 셀을 클릭하여 과목을 추가하거나 변경하세요
        </div>
      )}
    </div>
  );
}
