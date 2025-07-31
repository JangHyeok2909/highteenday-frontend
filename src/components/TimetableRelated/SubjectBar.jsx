import React, { useState } from 'react';
import './SubjectBar.css';

export default function SubjectBar({
  cell,            // { day: "MONDAY", period: 1 }
  assigned,        // null or { id, subjectDto: { subjectName } }
  allSubjects,     // 임시 하드코딩된 과목 리스트: [{ id, subjectName }, …]
  onAssign,        // (subjectId, cell) => void
  onUnassign       // (subjectId, cell) => void
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleAddClick = () => {
    setShowDropdown(true);
  };

  const handleSelect = (e) => {
    const subjectId = Number(e.target.value);
    if (!subjectId) return;
    onAssign(subjectId, cell);
    setShowDropdown(false);
  };

  const handleRemove = () => {
    if (assigned && assigned.id) {
      onUnassign(assigned.id, cell);
    }
  };

  return (
    <div className="subject-bar">
      {assigned ? (
        <div className="pill">
          <span style={{ marginRight: 8 }}>
            {assigned.subjectDto ? assigned.subjectDto.subjectName : '과목명 없음'}
          </span>
          <span className="remove-btn" onClick={handleRemove}>
            ×
          </span>
        </div>
      ) : (
        <button className="add-btn" onClick={handleAddClick}>
          ＋ 과목 추가
        </button>
      )}

      {showDropdown && !assigned && (
        <div className="dropdown">
          <select defaultValue="" onChange={handleSelect}>
            <option value="" disabled>
              과목을 선택하세요
            </option>
            {allSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subjectName}
              </option>
            ))}
          </select>
          <button className="cancel-btn" onClick={() => setShowDropdown(false)}>
            취소
          </button>
        </div>
      )}
    </div>
  );
}