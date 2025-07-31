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

  // 새 과목 생성
  const handleCreate = () => {
    if (!newSubjectName.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    onSubjectCreate(newSubjectName.trim())
      .then(() => {
        setNewSubjectName('');
        setIsCreating(false);
        onRefresh();
      })
      .catch(err => {
        console.error('과목 생성 실패:', err);
        alert('과목 생성 중 오류가 발생했습니다.');
      });
  };

  // 과목 수정 시작
  const startEdit = (subject) => {
    setEditingId(subject.id);
    setEditSubjectName(subject.subjectName);
  };

  // 과목 수정 저장
  const handleUpdate = () => {
    if (!editSubjectName.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    onSubjectUpdate(editingId, editSubjectName.trim())
      .then(() => {
        setEditingId(null);
        setEditSubjectName('');
        onRefresh();
      })
      .catch(err => {
        console.error('과목 수정 실패:', err);
        alert('과목 수정 중 오류가 발생했습니다.');
      });
  };

  // 과목 삭제
  const handleDelete = (subjectId, subjectName) => {
    if (!window.confirm(`'${subjectName}' 과목을 삭제하시겠습니까?`)) {
      return;
    }

    onSubjectDelete(subjectId)
      .then(() => {
        onRefresh();
      })
      .catch(err => {
        console.error('과목 삭제 실패:', err);
        alert('과목 삭제 중 오류가 발생했습니다.');
      });
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditSubjectName('');
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
          나의 과목 목록 ({subjects.filter(s => !s.isDefault).length + 3}개)
        </h4>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            + 과목 추가
          </button>
        )}
      </div>

      {/* 과목 생성 폼 */}
      {isCreating && (
        <div style={{
          marginBottom: 16,
          padding: 12,
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: 6
        }}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              placeholder="새 과목명을 입력하세요"
              style={{
                width: '100%',
                padding: 8,
                border: '1px solid #ced4da',
                borderRadius: 4,
                fontSize: 14,
                boxSizing: 'border-box'
              }}
              autoFocus
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={handleCreate}
              style={{
                padding: '6px 12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              생성
            </button>
            <button
              onClick={() => {
                setIsCreating(false);
                setNewSubjectName('');
              }}
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
        </div>
      )}

      {/* 과목 목록 */}
      <div>
        {subjects.length === 0 ? (
          <div style={{
            padding: 20,
            textAlign: 'center',
            color: '#6c757d',
            fontSize: 14,
            border: '1px dashed #dee2e6',
            borderRadius: 4
          }}>
            아직 과목이 없습니다.<br/>
            과목을 추가해보세요!
          </div>
        ) : (
          subjects.map(subject => (
            <div
              key={subject.id}
              style={{
                marginBottom: 8,
                padding: 12,
                backgroundColor: '#fff',
                border: '1px solid #dee2e6',
                borderRadius: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {editingId === subject.id && !subject.isDefault ? (
                // 수정 모드
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <input
                    type="text"
                    value={editSubjectName}
                    onChange={(e) => setEditSubjectName(e.target.value)}
                    style={{
                      flex: 1,
                      padding: 6,
                      border: '1px solid #ced4da',
                      borderRadius: 4,
                      fontSize: 14
                    }}
                    autoFocus
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUpdate();
                      }
                    }}
                  />
                  <button
                    onClick={handleUpdate}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: 3,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    저장
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: 3,
                      fontSize: 11,
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <span style={{
                    fontSize: 14,
                    color: '#495057',
                    fontWeight: 500,
                    flex: 1
                  }}>
                    {subject.subjectName}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {!subject.isDefault && (
                      <>
                        <button
                          onClick={() => startEdit(subject)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            border: 'none',
                            borderRadius: 3,
                            fontSize: 11,
                            cursor: 'pointer'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDelete(subject.id, subject.subjectName)}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: 3,
                            fontSize: 11,
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </>
                    )}
                    {subject.isDefault && (
                      <span style={{
                        padding: '4px 8px',
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
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}