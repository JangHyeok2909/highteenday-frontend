import React, { useState } from "react";
import { SelectedCell, Subject, TimetableEntry } from "./types";
import "./SubjectBar.css";

interface SubjectBarProps {
  cell: SelectedCell;
  assigned: TimetableEntry | undefined;
  allSubjects: Subject[];
  onAssign: (subjectId: number, cell: SelectedCell) => void;
  onUnassign: (userTimetableId: number) => void;
}

export default function SubjectBar({
  cell,
  assigned,
  allSubjects,
  onAssign,
  onUnassign,
}: SubjectBarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const handleSelect = () => {
    const subjectId = Number(selectedSubjectId);
    if (!subjectId) return alert("과목을 선택해주세요.");
    onAssign(subjectId, cell);
    setShowDropdown(false);
    setSelectedSubjectId("");
  };

  const handleCancel = () => {
    setShowDropdown(false);
    setSelectedSubjectId("");
  };

  if (assigned) {
    return (
      <div className="pill">
        <span>{assigned.subjectDto?.subjectName || "과목명 없음"}</span>
        <button
          type="button"
          className="remove-btn"
          onClick={() => assigned.id && onUnassign(assigned.id)}
          aria-label="과목 제거"
        >
          ×
        </button>
      </div>
    );
  }

  if (showDropdown) {
    return (
      <div className="dropdown">
        <select
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          autoFocus
        >
          <option value="" disabled>
            과목을 선택하세요
          </option>
          {allSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subjectName}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleSelect}
          disabled={!selectedSubjectId}
          className="add-btn"
        >
          저장
        </button>
        <button type="button" onClick={handleCancel} className="cancel-btn">
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowDropdown(true)}
      className="add-btn"
    >
      ＋ 과목 추가
    </button>
  );
}
