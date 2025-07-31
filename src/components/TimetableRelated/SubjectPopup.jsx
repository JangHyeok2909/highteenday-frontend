import React, { useState } from 'react';
import axios from 'axios';

function SubjectPopup({
  visible,
  onClose,
  cell,
  templateId,
  userTimetableId,
  onRefresh
}) {
  // 임시 과목 목록 (하드코딩)
  const subjectList = [
    { id: 1, subjectName: '국어' },
    { id: 2, subjectName: '수학' },
    { id: 3, subjectName: '영어' },
  ];

  const [selectedSubjectId, setSelectedSubjectId] = useState(null);

  const handleSave = () => {
    if (!selectedSubjectId || !cell.day || !cell.period) {
      alert('과목을 선택해주세요.');
      return;
    }

    axios
      .post(
        `/api/timetableTemplates/${templateId}/userTimetables`,
        {
          subjectId: selectedSubjectId,
          day: cell.day,
          period: String(cell.period),
        },
        { withCredentials: true }
      )
      .then(() => {
        onClose();
        setSelectedSubjectId(null);
        onRefresh();
      })
      .catch((err) => {
        console.error('과목 배정 실패:', err);
        alert('과목 배정 중 오류가 발생했습니다.');
      });
  };

  if (!visible) return null;

  return (
    <div className="popup-backdrop">
      <div className="popup-window">
        <h3>과목 선택 ({cell.day}, {cell.period}교시)</h3>
        <select
          value={selectedSubjectId || ''}
          onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
          style={{ width: '100%', marginBottom: 12 }}
        >
          <option value="" disabled>
            과목을 선택하세요
          </option>
          {subjectList.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subjectName}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose}>취소</button>
          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default SubjectPopup;
