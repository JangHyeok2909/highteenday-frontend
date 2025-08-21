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

  // ＋ 버튼 클릭 → 드롭다운 열기
  const handleAddClick = () => {
    setShowDropdown(true);
  };

  // 드롭다운에서 과목 선택 시 호출
  const handleSelect = (e) => {
    const subjectId = Number(e.target.value);
    if (!subjectId) return;
    onAssign(subjectId, cell);
    setShowDropdown(false);
  };

  // – 버튼 클릭 → 할당 해제
  const handleRemove = () => {
    if (assigned && assigned.id) {
      onUnassign(assigned.id, cell);
    }
  };

  return (
    <div className="subject-bar">
      {assigned ? (
        // 🎨 할당된 과목이 있을 때: 과목명 + 삭제 버튼
        <div className="pill">
          <span style={{ marginRight: 8 }}>
            {assigned.subjectDto ? assigned.subjectDto.subjectName : '과목명 없음'}
          </span>
          <span className="remove-btn" onClick={handleRemove}>
            ×
          </span>
        </div>
      ) : (
        // 🎨 할당된 과목이 없을 때: + 버튼
        <button className="add-btn" onClick={handleAddClick}>
          ＋ 과목 추가
        </button>
      )}

      {/* 🎨 셀에 과목이 없을 때만 드롭다운 노출 */}
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