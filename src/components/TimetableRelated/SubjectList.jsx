import React, { useState, useRef } from 'react';

function InputForm({ type, defaultValue, placeholder, isLoading, onSubmit, onCancel }) {
  const inputRef = useRef(null);

  const submit = () => {
    const val = inputRef.current?.value?.trim() || '';
    if (!val) return alert('과목명을 입력해주세요.');
    onSubmit(val);
  };

  return (
    <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 6 }}>
      {type === 'new' && <h5 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#495057', fontWeight: 600 }}>새 과목 추가</h5>}
      <input
        ref={inputRef}
        type="text"
        defaultValue={defaultValue || ''}
        placeholder={placeholder}
        disabled={isLoading}
        style={{ width: '100%', padding: 10, border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', marginBottom: type === 'new' ? 12 : 0 }}
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) submit(); }}
      />
      {type === 'new' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={submit} disabled={isLoading} style={{ padding: '8px 16px', backgroundColor: isLoading ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: 4, fontSize: 13, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
            {isLoading ? '생성 중...' : '생성'}
          </button>
          <button onClick={onCancel} disabled={isLoading} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, fontSize: 13, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            취소
          </button>
        </div>
      )}
    </div>
  );
}

export default function SubjectList({ subjects = [], onSubjectCreate, onSubjectUpdate, onSubjectDelete, onRefresh }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const run = async (fn) => {
    setIsLoading(true);
    try {
      await fn();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || '오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (name) => run(async () => {
    await onSubjectCreate(name);
    setIsCreating(false);
  });

  const handleUpdate = (name) => run(async () => {
    await onSubjectUpdate(editingId, name);
    setEditingId(null);
  });

  const handleDelete = (id, name) => run(async () => {
    if (!window.confirm(`'${name}' 과목을 삭제하시겠습니까?\n시간표에서도 함께 제거됩니다.`)) return;
    await onSubjectDelete(id);
  });

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ margin: 0, fontSize: 16, color: '#495057', fontWeight: 600 }}>
          과목 관리 ({subjects.length}개)
        </h4>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onRefresh} disabled={isLoading} style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
            {isLoading ? '로딩...' : '새로고침'}
          </button>
          {!isCreating && (
            <button onClick={() => setIsCreating(true)} disabled={isLoading} style={{ padding: '6px 12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
              + 과목 추가
            </button>
          )}
        </div>
      </div>

      {isCreating && (
        <InputForm
          key="create"
          type="new"
          placeholder="과목명을 입력하세요 (예: 수학, 영어, 과학)"
          isLoading={isLoading}
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
        />
      )}

      {subjects.length === 0 ? (
        <div style={{ padding: 32, textAlign: 'center', color: '#6c757d', fontSize: 14, border: '1px dashed #dee2e6', borderRadius: 4, backgroundColor: '#f8f9fa' }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📚</div>
          <p style={{ margin: '0 0 4px 0' }}>아직 등록된 과목이 없습니다.</p>
          <p style={{ margin: 0, fontSize: 12, color: '#adb5bd' }}>위의 '+ 과목 추가' 버튼을 눌러 과목을 추가해보세요!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 8 }}>
          {subjects.map(subject => (
            <div key={subject.id} style={{ padding: 12, backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              {editingId === subject.id ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <InputForm
                      key={`edit-${subject.id}`}
                      type="edit"
                      defaultValue={subject.subjectName}
                      isLoading={isLoading}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 14, color: '#495057', fontWeight: 500, flex: 1 }}>
                    {subject.subjectName}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => setEditingId(subject.id)} disabled={isLoading} style={{ padding: '4px 8px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: 3, fontSize: 11, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                      수정
                    </button>
                    <button onClick={() => handleDelete(subject.id, subject.subjectName)} disabled={isLoading} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 3, fontSize: 11, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {subjects.length > 0 && (
        <div style={{ marginTop: 16, padding: 12, backgroundColor: '#e7f3ff', border: '1px solid #b3d9ff', borderRadius: 4, fontSize: 12, color: '#0066cc' }}>
          💡 <strong>팁:</strong> 과목을 삭제하면 해당 과목이 배정된 시간표에서도 함께 제거됩니다.
        </div>
      )}
    </div>
  );
}
