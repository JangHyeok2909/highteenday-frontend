import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TimetableTemplateList from '../components/TimetableRelated/TimetableTemplateList';
import TimetableGrid from '../components/TimetableRelated/TimetableGrid';
import SubjectBar from '../components/TimetableRelated/SubjectBar';
import SubjectList from '../components/TimetableRelated/SubjectList';

export default function TimetablePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ day: null, period: null });
  const [error, setError] = useState(null);

  const API_BASE = '/api';

  const clearError = () => setError(null);

  const fetchTimetableData = async () => {
    if (!selectedTemplateId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/userTimetables`,
        { withCredentials: true }
      );
      
      const data = Array.isArray(response.data) ? response.data : [];
      setTimetableData(data);
      
    } catch (error) {
      console.error('시간표 조회 실패:', error);
      setError('시간표를 불러오는 중 오류가 발생했습니다.');
      setTimetableData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSubjects = async () => {
    if (!selectedTemplateId) return;
    
    try {
      const response = await axios.get(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/subjects`,
        { withCredentials: true }
      );
      
      const subjects = Array.isArray(response.data) ? response.data : [];
      setAllSubjects(subjects);
      
    } catch (error) {
      console.error('과목 목록 조회 실패:', error);
      setAllSubjects([]);
    }
  };

  const handleSubjectCreate = async (subjectName) => {
    if (!selectedTemplateId) {
      throw new Error('템플릿이 선택되지 않았습니다.');
    }

    try {
      const response = await axios.post(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/subjects`,
        { subjectName: subjectName },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      await fetchSubjects();
      return response.data;
    } catch (error) {
      console.error('과목 생성 실패:', error);
      throw error;
    }
  };

  const handleSubjectUpdate = async (subjectId, subjectName) => {
    if (!selectedTemplateId) {
      throw new Error('템플릿이 선택되지 않았습니다.');
    }

    try {
      const response = await axios.put(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/subjects/${subjectId}`,
        { subjectName: subjectName },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      await fetchSubjects();
      return response.data;
    } catch (error) {
      console.error('과목 수정 실패:', error);
      throw error;
    }
  };

  const handleSubjectDelete = async (subjectId) => {
    if (!selectedTemplateId) {
      throw new Error('템플릿이 선택되지 않았습니다.');
    }

    try {
      await axios.delete(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/subjects/${subjectId}`,
        { withCredentials: true }
      );
      
      await fetchSubjects();
      await fetchTimetableData();
      
    } catch (error) {
      console.error('과목 삭제 실패:', error);
      throw error;
    }
  };

  const handleAssign = async (subjectId, cell) => {
    if (!selectedTemplateId) {
      alert('템플릿이 선택되지 않았습니다.');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/userTimetables`,
        {
          subjectId: Number(subjectId),
          day: cell.day,
          period: String(cell.period)
        },
        { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      await fetchTimetableData();
      setSelectedCell({ day: null, period: null });
      
    } catch (error) {
      console.error('과목 할당 실패:', error);
      
      if (error.response?.status === 409) {
        alert('해당 시간에 이미 과목이 배정되어 있습니다.');
      } else {
        alert('과목 할당 중 오류가 발생했습니다.');
      }
    }
  };

  const handleUnassign = async (userTimetableId) => {
    if (!selectedTemplateId) {
      alert('템플릿이 선택되지 않았습니다.');
      return;
    }

    try {
      await axios.delete(
        `${API_BASE}/timetableTemplates/${selectedTemplateId}/userTimetables/${userTimetableId}`,
        { withCredentials: true }
      );
      
      await fetchTimetableData();
      setSelectedCell({ day: null, period: null });
      
    } catch (error) {
      console.error('과목 제거 실패:', error);
      alert('과목 제거에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (selectedTemplateId) {
      setError(null);
      fetchTimetableData();
      fetchSubjects();
    } else {
      setTimetableData([]);
      setAllSubjects([]);
      setSelectedCell({ day: null, period: null });
      setIsEditMode(false);
    }
  }, [selectedTemplateId]);

  const handleCellClick = (day, period) => {
    if (!isEditMode) return;
    setSelectedCell({ day, period });
  };

  const findAssigned = () =>
    timetableData.find(
      entry =>
        entry.day === selectedCell.day &&
        entry.period === String(selectedCell.period)
    );

  const refreshSubjects = () => {
    fetchSubjects();
  };

  const toggleEditMode = () => {
    setIsEditMode(prev => {
      if (prev) {
        setSelectedCell({ day: null, period: null });
      }
      return !prev;
    });
  };

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, minHeight: '100vh' }}>
      <aside style={{ width: 300, background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <TimetableTemplateList onSelectTemplate={setSelectedTemplateId} />
      </aside>

      <main style={{ flex: 1, background: '#fff', padding: 16, borderRadius: 8 }}>
        {error && (
          <div style={{
            marginBottom: 16,
            padding: 12,
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            borderRadius: 4,
            color: '#721c24'
          }}>
            <strong>오류:</strong> {error}
            <button 
              onClick={clearError}
              style={{
                float: 'right',
                background: 'none',
                border: 'none',
                color: '#721c24',
                cursor: 'pointer',
                fontSize: 16,
                fontWeight: 'bold'
              }}
            >
              ×
            </button>
          </div>
        )}

        {selectedTemplateId ? (
          <>
            <div style={{ 
              marginBottom: 16, 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              paddingBottom: 16
            }}>
              <h2 style={{ margin: 0, color: '#333' }}>
                시간표 (템플릿 ID: {selectedTemplateId})
              </h2>
              <button
                onClick={toggleEditMode}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isEditMode ? '#dc3545' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                {isEditMode ? '수정 완료' : '시간표 수정'}
              </button>
            </div>

            {isLoading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: 40,
                color: '#6c757d'
              }}>
                <div style={{ marginBottom: 8 }}>⏳</div>
                <p>시간표 불러오는 중...</p>
              </div>
            ) : (
              <>
                <TimetableGrid
                  timetableData={timetableData}
                  isEditMode={isEditMode}
                  onCellClick={handleCellClick}
                  selectedCell={selectedCell}
                />

                {isEditMode && selectedCell.day && (
                  <div style={{ 
                    marginTop: 16,
                    padding: 16,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 12px 0',
                      color: '#495057',
                      fontSize: 16
                    }}>
                      선택된 시간: {selectedCell.day === 'MONDAY' ? '월요일' :
                                selectedCell.day === 'TUESDAY' ? '화요일' :
                                selectedCell.day === 'WEDNESDAY' ? '수요일' :
                                selectedCell.day === 'THURSDAY' ? '목요일' :
                                selectedCell.day === 'FRIDAY' ? '금요일' : selectedCell.day}, {selectedCell.period}교시
                    </h4>
                    <SubjectBar
                      cell={selectedCell}
                      assigned={findAssigned()}
                      allSubjects={allSubjects}
                      onAssign={handleAssign}
                      onUnassign={handleUnassign}
                    />
                  </div>
                )}

                <div style={{ marginTop: 24 }}>
                  <SubjectList 
                    subjects={allSubjects}
                    onSubjectCreate={handleSubjectCreate}
                    onSubjectUpdate={handleSubjectUpdate} 
                    onSubjectDelete={handleSubjectDelete}
                    onRefresh={refreshSubjects}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: 60,
            color: '#6c757d'
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <h3 style={{ marginBottom: 8 }}>시간표 템플릿을 선택해주세요</h3>
            <p>왼쪽 목록에서 템플릿을 선택하면 개인별 시간표가 표시됩니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}