import React, { useState } from 'react';

export default function SubjectBar({
  cell,            
  assigned,        
  allSubjects,     
  onAssign,        
  onUnassign       
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const handleAddClick = () => {
    setShowDropdown(true);
  };

  const handleSelect = () => {
    const subjectId = Number(selectedSubjectId);
    if (!subjectId) {
      alert('과목을 선택해주세요.');
      return;
    }
    onAssign(subjectId, cell);
    setShowDropdown(false);
    setSelectedSubjectId('');
  };

  const handleRemove = () => {
    if (assigned && assigned.id) {
      onUnassign(assigned.id);
    }
  };

  const handleCancel = () => {
    setShowDropdown(false);
    setSelectedSubjectId('');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: 12,
      border: '1px solid #dee2e6',
      borderRadius: 6,
      background: '#fff'
    }}>
      {assigned ? (
        <div style={{
          background: '#e8f5e8',
          border: '1px solid #28a745',
          borderRadius: 20,
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          color: '#155724',
          fontWeight: 500
        }}>
          <span style={{ marginRight: 8 }}>
            {assigned.subjectDto ? assigned.subjectDto.subjectName : '과목명 없음'}
          </span>
          <span 
            onClick={handleRemove}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 18,
              height: 18,
              color: '#dc3545',
              cursor: 'pointer',
              borderRadius: '50%',
              fontSize: 14,
              fontWeight: 'bold',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#dc3545';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#dc3545';
            }}
          >
            ×
          </span>
        </div>
      ) : (
        showDropdown ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              style={{
                flex: 1,
                padding: '6px 12px',
                border: '1px solid #ced4da',
                borderRadius: 4,
                fontSize: 14,
                background: 'white'
              }}
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
              onClick={handleSelect}
              disabled={!selectedSubjectId}
              style={{
                padding: '6px 12px',
                backgroundColor: selectedSubjectId ? '#007bff' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: selectedSubjectId ? 'pointer' : 'not-allowed',
                fontWeight: 500
              }}
            >
              저장
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              취소
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            style={{
              fontSize: 14,
              border: '1px solid #007bff',
              background: '#007bff',
              color: 'white',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 4,
              fontWeight: 500,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#0056b3';
              e.target.style.borderColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = '#007bff';
              e.target.style.borderColor = '#007bff';
            }}
          >
            ＋ 과목 추가
          </button>
        )
      )}
    </div>
  );
}