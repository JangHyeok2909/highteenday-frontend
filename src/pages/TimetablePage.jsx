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

  // 🎯 하드코딩 기본 과목 + 개인 생성 과목 합쳐서 관리
  const [personalSubjects, setPersonalSubjects] = useState([]); // 개인 생성 과목
  
  // 기본 하드코딩 과목 (항상 제공)
  const defaultSubjects = [
    { id: 1, subjectName: '국어', isDefault: true },
    { id: 2, subjectName: '수학', isDefault: true },
    { id: 3, subjectName: '영어', isDefault: true },
  ];

  // 전체 과목 목록 = 기본 과목 + 개인 과목
  const allSubjects = [...defaultSubjects, ...personalSubjects];

  // 🎯 개인 과목 생성 (클라이언트 상태로만 처리)
  const handleSubjectCreate = (subjectName) => {
    return new Promise((resolve) => {
      console.log('🔄 개인 과목 생성:', subjectName);
      
      const newSubject = {
        id: Date.now(), // 임시 ID (기본 과목과 겹치지 않게)
        subjectName: subjectName,
        isDefault: false // 개인 생성 과목 표시
      };
      
      setPersonalSubjects(prev => [...prev, newSubject]);
      resolve(newSubject);
    });
  };

  // 🎯 개인 과목 수정 (기본 과목은 수정 불가)
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

  // 🎯 개인 과목 삭제 (기본 과목은 삭제 불가)
  const handleSubjectDelete = (subjectId) => {
    return new Promise((resolve) => {
      console.log('🔄 개인 과목 삭제:', subjectId);
      
      // 개인 과목 목록에서 삭제
      setPersonalSubjects(prev => prev.filter(subject => subject.id !== subjectId));
      
      // 시간표에서도 해당 과목 제거
      setTimetableData(prev => 
        prev.filter(entry => entry.subjectDto.id !== subjectId)
      );
      
      resolve();
    });
  };

  // 🎯 더미 과목 목록 새로고침
  const fetchSubjects = () => {
    console.log('📚 전체 과목 목록:', allSubjects);
    // 클라이언트 상태 기반이므로 별도 처리 불필요
  };

  // 🔧 템플릿 조회 (에러 무시하고 진행)
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

  // userTimetableId 설정
  useEffect(() => {
    if (selectedTemplateId != null) {
      const tempUserTimetableId = selectedTemplateId;
      setUserTimetableId(tempUserTimetableId);
      console.log('Template selected:', selectedTemplateId, 'UserTimetable:', tempUserTimetableId);
    }
  }, [selectedTemplateId]);

  // 템플릿 선택 시 데이터 로딩
  useEffect(() => {
    if (selectedTemplateId) {
      fetchTimetableData();
    }
  }, [selectedTemplateId]);

  // 🔧 과목 할당 (클라이언트 상태로만 처리)
  const handleAssign = (subjectId, cell) => {
    if (!selectedTemplateId) {
      alert('템플릿이 선택되지 않았습니다.');
      return;
    }

    console.log('과목 할당 시도:', { templateId: selectedTemplateId, subjectId, cell });

    // 선택된 과목 찾기 (기본 과목 + 개인 과목에서)
    const selectedSubject = allSubjects.find(s => s.id === Number(subjectId));
    
    if (!selectedSubject) {
      alert('선택된 과목을 찾을 수 없습니다.');
      return;
    }

    // 클라이언트 상태에서 바로 할당
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

  // 🔧 과목 삭제 (클라이언트 상태로만 처리)
  const handleUnassign = (entryId) => {
    console.log('과목 삭제 시도:', entryId);
    
    setTimetableData(prev => prev.filter(item => item.id !== entryId));
    setSelectedCell({ day: null, period: null });
    console.log('✅ 과목 삭제 완료 (클라이언트)');
  };
  
  // 셀 클릭 핸들러
  const handleCellClick = (day, period) => {
    if (!isEditMode) return;
    setSelectedCell({ day, period });
  };

  // 선택된 셀에 배정된 과목 찾기
  const findAssigned = () =>
    timetableData.find(
      entry =>
        entry.day === selectedCell.day &&
        entry.period === String(selectedCell.period)
    );

  return (
    <div style={{ display: 'flex', gap: 16, padding: 16, minHeight: '100vh' }}>
      {/* 좌측: 템플릿 목록 */}
      <aside style={{ width: 300, background: '#f8f9fa', padding: 16, borderRadius: 8 }}>
        <TimetableTemplateList onSelectTemplate={setSelectedTemplateId} />
      </aside>

      {/* 우측: 그리드 + 수정 토글 + SubjectBar + 과목리스트 */}
      <main style={{ flex: 1, background: '#fff', padding: 16, borderRadius: 8 }}>
        {selectedTemplateId ? (
          <>
            {/* 🎨 수정/조회 모드 토글 버튼 */}
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
                      // 수정완료 시 선택 해제
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
                {/* 🎨 시간표 그리드 */}
                <TimetableGrid
                  timetableData={timetableData}
                  isEditMode={isEditMode}
                  onCellClick={handleCellClick}
                  selectedCell={selectedCell}
                />

                {/* 🎨 수정모드일 때만 SubjectBar 표시 */}
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

                {/* 🎨 과목 목록 (기본 + 개인) */}
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