import React, { useState, useEffect } from 'react';
import axios from 'axios';

import TimetableTemplateList from '../components/TimetableRelated/TimetableTemplateList';
import TimetableGrid from '../components/TimetableRelated/TimetableGrid';
import SubjectBar from '../components/TimetableRelated/SubjectBar';
import SubjectList from '../components/TimetableRelated/SubjectList';

export default function TimetablePage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [userTimetableId, setUserTimetableId] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ day: null, period: null });

  const [personalSubjects, setPersonalSubjects] = useState([]); // 개인 생성 과목
  
  const defaultSubjects = [
    { id: 1, subjectName: '국어', isDefault: true },
    { id: 2, subjectName: '수학', isDefault: true },
    { id: 3, subjectName: '영어', isDefault: true },
  ];

  const allSubjects = [...defaultSubjects, ...personalSubjects];

  // 개인 과목 생성 (클라이언트 상태로만 처리)
  const handleSubjectCreate = (subjectName) => {
    return new Promise((resolve) => {
      console.log('🔄 개인 과목 생성:', subjectName);
      
      const newSubject = {
        id: Date.now(), // 임시 ID 
        subjectName: subjectName,
        isDefault: false
      };
      
      setPersonalSubjects(prev => [...prev, newSubject]);
      resolve(newSubject);
    });
  };

  const handleSubjectUpdate = (subjectId, subjectName) => {
    return new Promise((resolve) => {
      console.log('🔄 개인 과목 수정:', subjectId, subjectName);
      
      setPersonalSubjects(prev => 
        prev.map(subject => 
          subject.id === subjectId 
            ? { ...subject, subjectName }
            : subject
        )
      );
      resolve({ id: subjectId, subjectName });
    });
  };

  const handleSubjectDelete = (subjectId) => {
    return new Promise((resolve) => {
      console.log('🔄 개인 과목 삭제:', subjectId);
      
      setPersonalSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      
      setTimetableData(prev => 
        prev.filter(entry => entry.subjectDto.id !== subjectId)
      );
      
      resolve();
    });
  };

  // 더미 과목 목록 새로고침
  const fetchSubjects = () => {
    console.log('📚 전체 과목 목록:', allSubjects);
  };

  // 템플릿 조회 (에러 무시하고 진행)
  const fetchTimetableData = () => {
    if (!selectedTemplateId) return;
    
    setIsLoading(true);
    console.log('데이터 조회 시도 - templateId:', selectedTemplateId);
    
    // API 시도하되 실패해도 진행
    axios
      .get(`/api/timetableTemplates/${selectedTemplateId}`, { withCredentials: true })
      .then(res => {
        console.log('✅ 템플릿 정보 조회 성공:', res.data);
      })
      .catch(err => {
        console.error('❌ 템플릿 조회 실패 (무시하고 진행):', err);
      })
      .finally(() => {
        // 성공/실패 관계없이 빈 시간표로 시작
        setTimetableData([]);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (selectedTemplateId != null) {
      const tempUserTimetableId = selectedTemplateId;
      setUserTimetableId(tempUserTimetableId);
      console.log('Template selected:', selectedTemplateId, 'UserTimetable:', tempUserTimetableId);
    }
  }, [selectedTemplateId]);

  useEffect(() => {
    if (selectedTemplateId) {
      fetchTimetableData();
    }
  }, [selectedTemplateId]);

  // 과목 할당 (클라이언트 상태로만 처리)
  const handleAssign = (subjectId, cell) => {
    if (!selectedTemplateId) {
      alert('템플릿이 선택되지 않았습니다.');
      return;
    }

    console.log('과목 할당 시도:', { templateId: selectedTemplateId, subjectId, cell });

    const selectedSubject = allSubjects.find(s => s.id === Number(subjectId));
    
    if (!selectedSubject) {
      alert('선택된 과목을 찾을 수 없습니다.');
      return;
    }

    const newEntry = {
      id: Date.now(), // 임시 ID
      day: cell.day,
      period: String(cell.period),
      subjectDto: {
        id: subjectId,
        subjectName: selectedSubject.subjectName
      }
    };
    
    setTimetableData(prev => [...prev, newEntry]);
    setSelectedCell({ day: null, period: null });
    console.log('✅ 과목 할당 완료 (클라이언트):', selectedSubject.subjectName);
  };

  // 과목 삭제 (클라이언트 상태로만 처리)
  const handleUnassign = (entryId) => {
    console.log('과목 삭제 시도:', entryId);
    
    setTimetableData(prev => prev.filter(item => item.id !== entryId));
    setSelectedCell({ day: null, period: null });
    console.log('✅ 과목 삭제 완료 (클라이언트)');
  };
  
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

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, minHeight: '100vh' }}>
      <aside style={{ width: 300, background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <TimetableTemplateList onSelectTemplate={setSelectedTemplateId} />
      </aside>

      <main style={{ flex: 1, background: '#fff', padding: 16, borderRadius: 8 }}>
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
              <h2 style={{ margin: 0, color: '#333' }}>시간표</h2>
              <button
                onClick={() => {
                  setIsEditMode(prev => {
                    if (prev) {
                      setSelectedCell({ day: null, period: null });
                    }
                    return !prev;
                  });
                }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: isEditMode ? '#dc3545' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                {isEditMode ? '수정 완료' : '시간표 수정'}
              </button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
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
                    padding: 12,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #dee2e6'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 8px 0',
                      color: '#495057',
                      fontSize: 14
                    }}>
                      과목 선택 ({selectedCell.day}, {selectedCell.period}교시)
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
                    onRefresh={fetchSubjects}
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
            <h3>시간표 템플릿을 선택해주세요</h3>
            <p>왼쪽 목록에서 템플릿을 선택하면 시간표가 표시됩니다.</p>
          </div>
        )}
      </main>
    </div>
  );
}