import React, { useState } from 'react';
import axios from 'axios';

function SubjectPopup({
  visible,
  onClose,
  cell,
  templateId,
  userTimetableId,
  allSubjects = [],
  onRefresh
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedSubjectId || !cell.day || !cell.period) {
      alert('과목을 선택해주세요.');
      return;
    }

    if (!templateId) {
      alert('템플릿이 선택되지 않았습니다.');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔄 과목 배정 시작:', {
        templateId,
        userTimetableId,
        subjectId: selectedSubjectId,
        day: cell.day,
        period: cell.period
      });

      const response = await axios.post(
        `/api/timetableTemplates/${templateId}/userTimetables`,
        {
          subjectId: Number(selectedSubjectId),
          day: cell.day,
          period: String(cell.period),
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ 과목 배정 성공:', response.data);
      
      onClose();
      setSelectedSubjectId(null);
      
      if (onRefresh) {
        onRefresh();
      }
      
      alert('과목이 성공적으로 배정되었습니다!');

    } catch (error) {
      console.error('❌ 과목 배정 실패:', error);
      
      if (error.response?.status === 400) {
        alert('잘못된 요청입니다. 입력 데이터를 확인해주세요.');
      } else if (error.response?.status === 404) {
        alert('템플릿이나 과목을 찾을 수 없습니다.');
      } else if (error.response?.status === 500) {
        alert('서버 내부 오류가 발생했습니다.');
      } else {
        alert('과목 배정 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSubjectId(null);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className="popup-backdrop" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="popup-window" style={{
        backgroundColor: 'white',
        padding: 24,
        borderRadius: 8,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        minWidth: 320,
        maxWidth: 400
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: 18,
          fontWeight: 600,
          color: '#333'
        }}>
          과목 선택
        </h3>
        
        <div style={{
          marginBottom: 12,
          padding: 8,
          backgroundColor: '#f8f9fa',
          borderRadius: 4,
          fontSize: 14,
          color: '#666'
        }}>
          📅 {cell.day === 'MONDAY' ? '월요일' : 
              cell.day === 'TUESDAY' ? '화요일' :
              cell.day === 'WEDNESDAY' ? '수요일' :
              cell.day === 'THURSDAY' ? '목요일' :
              cell.day === 'FRIDAY' ? '금요일' : cell.day}, {cell.period}교시
        </div>

        {allSubjects.length === 0 ? (
          <div style={{
            padding: 20,
            textAlign: 'center',
            color: '#6c757d',
            fontSize: 14,
            border: '1px dashed #dee2e6',
            borderRadius: 4,
            marginBottom: 16
          }}>
            사용 가능한 과목이 없습니다.<br/>
            먼저 과목을 추가해주세요.
          </div>
        ) : (
          <select
            value={selectedSubjectId || ''}
            onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
            style={{ 
              width: '100%', 
              marginBottom: 16,
              padding: 10,
              border: '1px solid #dee2e6',
              borderRadius: 4,
              fontSize: 14,
              backgroundColor: 'white'
            }}
            disabled={isLoading}
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
        )}

        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 8 
        }}>
          <button 
            onClick={handleClose}
            disabled={isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            취소
          </button>
          <button 
            onClick={handleSave}
            disabled={isLoading || !selectedSubjectId}
            style={{
              padding: '8px 16px',
              backgroundColor: isLoading || !selectedSubjectId ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: isLoading || !selectedSubjectId ? 'not-allowed' : 'pointer',
              fontSize: 14
            }}
          >
            {isLoading ? '처리중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubjectPopup;