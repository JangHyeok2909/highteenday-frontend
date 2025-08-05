import React, { useState } from 'react';

export default function SubjectList({ 
  subjects = [], 
  onSubjectCreate, 
  onSubjectUpdate, 
  onSubjectDelete,
  onRefresh 
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editSubjectName, setEditSubjectName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!newSubjectName.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await onSubjectCreate(newSubjectName.trim());
      setNewSubjectName('');
      setIsCreating(false);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('과목 생성 실패:', err);
      alert('과목 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject.id);
    setEditSubjectName(subject.subjectName);
  };

  // 과목 수정 저장
  const handleUpdate = async () => {
    if (!editSubjectName.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      await onSubjectUpdate(editingId, editSubjectName.trim());
      setEditingId(null);
      setEditSubjectName('');
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('과목 수정 실패:', err);
      alert('과목 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (subjectId, subjectName) => {
    if (!window.confirm(`'${subjectName}' 과목을 삭제하시겠습니까?\n시간표에서도 함께 제거됩니다.`)) {
      return;
    }

    setIsLoading(true);
    try {
      await onSubjectDelete(subjectId);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('과목 삭제 실패:', err);
      alert('과목 삭제 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubjectName('');
  };

  const cancelCreate = () => {
    setIsCreating(false);
    setNewSubjectName('');
  };

  // Enter 키 처리
  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="subject-list" style={{ marginTop: 24 }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16
      }}>
        <h4 style={{ 
          margin: 0,
          fontSize: 16,
          color: '#495057',
          fontWeight: 600
        }}>
          과목 관리 ({subjects.length}개)
        </h4>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              {isLoading ? '로딩...' : '새로고침'}
            </button>
          )}
          
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              disabled={isLoading}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              + 과목 추가
            </button>
          )}
        </div>
      </div>

      {/* 과목 생성 폼 */}
      {isCreating && (
        <div style={{
          marginBottom: 16,
          padding: 16,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: 6
        }}>
          <h5 style={{ 
            margin: '0 0 12px 0',
            fontSize: 14,
            color: '#495057',
            fontWeight: 600
          }}>
            새 과목 추가
          </h5>
          <div style={{ marginBottom: 12 }}>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="과목명을 입력하세요 (예: 수학, 영어, 과학)"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: 10,
                border: '1px solid #ced4da',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
              autoFocus
              onKeyPress={(e) => handleKeyPress(e, handleCreate)}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={handleCreate}
              disabled={isLoading || !newSubjectName.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: isLoading || !newSubjectName.trim() ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 13,
                cursor: isLoading || !newSubjectName.trim() ? 'not-allowed' : 'pointer',
                fontWeight: 500
              }}
            >
              {isLoading ? '생성 중...' : '생성'}
            </button>
            <button
              onClick={cancelCreate}
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 13,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              취소
            </button>
          </div>
        </div>
      )}

      {/* 과목 목록 */}
      <div>
        {subjects.length === 0 ? (
          <div style={{
            padding: 32,
            textAlign: 'center',
            color: '#6c757d',
            fontSize: 14,
            border: '1px dashed #dee2e6',
            borderRadius: 4,
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
            <p style={{ margin: 0, marginBottom: 4 }}>아직 등록된 과목이 없습니다.</p>
            <p style={{ margin: 0, fontSize: 12, color: '#adb5bd' }}>
              위의 '+ 과목 추가' 버튼을 눌러 과목을 추가해보세요!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {subjects.map(subject => (
              <div
                key={subject.id}
                style={{
                  padding: 12,
                  backgroundColor: '#fff',
                  border: '1px solid #dee2e6',
                  borderRadius: 6,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {editingId === subject.id ? (
                  // 수정 모드
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                    <input
                      type="text"
                      value={editSubjectName}
                      onChange={(e) => setEditSubjectName(e.target.value)}
                      disabled={isLoading}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #ced4da',
                        borderRadius: 4,
                        fontSize: 14
                      }}
                      autoFocus
                      onKeyPress={(e) => handleKeyPress(e, handleUpdate)}
                    />
                    <button
                      onClick={handleUpdate}
                      disabled={isLoading || !editSubjectName.trim()}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: isLoading || !editSubjectName.trim() ? '#ccc' : '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: isLoading || !editSubjectName.trim() ? 'not-allowed' : 'pointer',
                        fontWeight: 500
                      }}
                    >
                      {isLoading ? '저장 중...' : '저장'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      disabled={isLoading}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: isLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  // 일반 모드
                  <>
                    <div style={{ flex: 1 }}>
                      <span style={{
                        fontSize: 14,
                        color: '#495057',
                        fontWeight: 500
                      }}>
                        {subject.subjectName}
                      </span>
                      {subject.isDefault && (
                        <span style={{
                          marginLeft: 8,
                          padding: '2px 6px',
                          backgroundColor: '#e9ecef',
                          color: '#6c757d',
                          borderRadius: 3,
                          fontSize: 10,
                          fontWeight: 500
                        }}>
                          기본과목
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!subject.isDefault && (
                        <>
                          <button
                            onClick={() => startEdit(subject)}
                            disabled={isLoading}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ffc107',
                              color: '#212529',
                              border: 'none',
                              borderRadius: 3,
                              fontSize: 11,
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              fontWeight: 500
                            }}
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(subject.id, subject.subjectName)}
                            disabled={isLoading}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: 3,
                              fontSize: 11,
                              cursor: isLoading ? 'not-allowed' : 'pointer',
                              fontWeight: 500
                            }}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 도움말 */}
      {subjects.length > 0 && (
        <div style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: '#e7f3ff',
          border: '1px solid #b3d9ff',
          borderRadius: 4,
          fontSize: 12,
          color: '#0066cc'
        }}>
          💡 <strong>팁:</strong> 과목을 삭제하면 해당 과목이 배정된 시간표에서도 함께 제거됩니다. 
          시간표 수정 모드에서 셀을 클릭하여 과목을 배정할 수 있습니다.
        </div>
      )}
    </div>
  );
}