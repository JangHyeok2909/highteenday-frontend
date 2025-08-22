import React from 'react';

// 요일, 교시 상수
const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const DAY_LABELS = {
  'MONDAY': '월',
  'TUESDAY': '화', 
  'WEDNESDAY': '수',
'THURSDAY': '목',
  'FRIDAY': '금'
};
const PERIODS = [1, 2, 3, 4, 5, 6, 7, 8];

export default function TimetableGrid({ 
  timetableData = [], 
  isEditMode = false, 
  onCellClick,
  selectedCell 
}) {
  
  // 특정 요일/교시에 해당하는 과목 찾기
  const findSubject = (day, period) => {
    return timetableData.find(
      entry => entry.day === day && entry.period === String(period)
    );
  };

  // 셀 클릭 핸들러
  const handleCellClick = (day, period) => {
    if (isEditMode && onCellClick) {
      onCellClick(day, period);
    }
  };

  // 셀이 선택되었는지 확인
  const isCellSelected = (day, period) => {
    return selectedCell && 
           selectedCell.day === day && 
           selectedCell.period === period;
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        className="timetable-grid"
        style={{ 
          borderCollapse: 'collapse', 
          width: '100%',
          minWidth: 600,
          backgroundColor: '#fff',
          border: '1px solid #dee2e6'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ 
              padding: '12px 8px',
              border: '1px solid #dee2e6',
              fontWeight: 600,
              color: '#495057',
              minWidth: 60
            }}>
              교시
            </th>
            {DAYS.map(day => (
              <th key={day} style={{ 
                padding: '12px 8px',
                border: '1px solid #dee2e6',
                fontWeight: 600,
                color: '#495057',
                minWidth: 120
              }}>
                {DAY_LABELS[day]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map(period => (
            <tr key={period}>
              <td style={{ 
                fontWeight: 600, 
                padding: '12px 8px',
                border: '1px solid #dee2e6',
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                color: '#495057'
              }}>
                {period}
              </td>
              {DAYS.map(day => {
                const subject = findSubject(day, period);
                const isSelected = isCellSelected(day, period);
                
                return (
                  <td
                    key={day}
                    onClick={() => handleCellClick(day, period)}
                    style={{
                      height: 50,
                      border: '1px solid #dee2e6',
                      textAlign: 'center',
                      cursor: isEditMode ? 'pointer' : 'default',
                      backgroundColor: isSelected ? '#e3f2fd' : (subject ? '#f0f8f0' : '#fff'),
                      borderColor: isSelected ? '#2196f3' : '#dee2e6',
                      borderWidth: isSelected ? 2 : 1,
                      position: 'relative',
                      verticalAlign: 'middle',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {subject ? (
                      <div style={{ 
                        padding: '4px 8px',
                        fontSize: 12,
                        color: '#2e7d32',
                        fontWeight: 500
                      }}>
                        {subject.subjectDto ? subject.subjectDto.subjectName : '과목명 없음'}
                        {isEditMode && (
                          <div style={{
                            position: 'absolute',
                            top: 2,
                            right: 4,
                            fontSize: 10,
                            color: '#dc3545',
                            fontWeight: 'bold'
                          }}>
                            ×
                          </div>
                        )}
                      </div>
                    ) : (
                      isEditMode ? (
                        <span style={{ 
                          fontSize: 18, 
                          color: '#6c757d',
                          fontWeight: 300
                        }}>
                          ＋
                        </span>
                      ) : null
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* 수정모드 안내문구 */}
      {isEditMode && (
        <div style={{
          marginTop: 12,
          padding: 8,
          backgroundColor: '#e7f3ff',
          borderRadius: 4,
          fontSize: 12,
          color: '#0066cc',
          textAlign: 'center'
        }}>
          💡 셀을 클릭하여 과목을 추가하거나 변경하세요
        </div>
      )}
    </div>
  );
}