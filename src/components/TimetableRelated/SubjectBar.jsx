import React, { useState } from 'react';

export default function SubjectBar({ cell, assigned, allSubjects, onAssign, onUnassign }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const handleAction = (action) => {
    const actions = {
      add: () => setShowDropdown(true),
      select: () => {
        const subjectId = Number(selectedSubjectId);
        if (!subjectId) return alert('과목을 선택해주세요.');
        onAssign(subjectId, cell);
        setShowDropdown(false);
        setSelectedSubjectId('');
      },
      remove: () => assigned?.id && onUnassign(assigned.id),
      cancel: () => {
        setShowDropdown(false);
        setSelectedSubjectId('');
      }
    };
    actions[action]();
  };

  if (assigned) {
    return (
      <div className="pill">
        <span>{assigned.subjectDto?.subjectName || '과목명 없음'}</span>
        <span className="remove-btn" onClick={() => handleAction('remove')}>×</span>
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
          <option value="" disabled>과목을 선택하세요</option>
          {allSubjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.subjectName}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleAction('select')}
          disabled={!selectedSubjectId}
          className="add-btn"
          style={{ 
            backgroundColor: selectedSubjectId ? '#007bff' : '#ccc',
            cursor: selectedSubjectId ? 'pointer' : 'not-allowed'
          }}
        >
          저장
        </button>
        <button onClick={() => handleAction('cancel')} className="cancel-btn">
          취소
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => handleAction('add')} className="add-btn">
      ＋ 과목 추가
    </button>
  );
}