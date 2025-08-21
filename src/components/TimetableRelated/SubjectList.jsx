import React, { useState } from 'react';

export default function SubjectList({ subjects = [], onSubjectCreate, onSubjectUpdate, onSubjectDelete, onRefresh }) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ new: '', edit: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action, ...args) => {
    setIsLoading(true);
    try {
      const actions = {
        create: async () => {
          if (!formData.new.trim()) return alert('과목명을 입력해주세요.');
          await onSubjectCreate(formData.new.trim());
          setFormData(prev => ({ ...prev, new: '' }));
          setIsCreating(false);
        },
        update: async () => {
          if (!formData.edit.trim()) return alert('과목명을 입력해주세요.');
          await onSubjectUpdate(editingId, formData.edit.trim());
          setEditingId(null);
          setFormData(prev => ({ ...prev, edit: '' }));
        },
        delete: async (id, name) => {
          if (!window.confirm(`'${name}' 과목을 삭제하시겠습니까?\n시간표에서도 함께 제거됩니다.`)) return;
          await onSubjectDelete(id);
        }
      };
      
      await actions[action](...args);
      onRefresh?.();
    } catch (err) {
      console.error(`과목 ${action} 실패:`, err);
      alert(`과목 ${action === 'create' ? '생성' : action === 'update' ? '수정' : '삭제'} 중 오류가 발생했습니다.`);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (subject) => {
    setEditingId(subject.id);
    setFormData(prev => ({ ...prev, edit: subject.subjectName }));
  };

  const handleKeyPress = (e, action) => e.key === 'Enter' && action();

  const InputForm = ({ type, placeholder, onSubmit, onCancel }) => (
    <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: 6 }}>
      {type === 'new' && <h5 style={{ margin: '0 0 12px 0', fontSize: 14, color: '#495057', fontWeight: 600 }}>새 과목 추가</h5>}
      <input
        type="text"
        value={formData[type]}
        onChange={(e) => setFormData(prev => ({ ...prev, [type]: e.target.value }))}
        placeholder={placeholder}
        disabled={isLoading}
        style={{ width: '100%', padding: 10, border: '1px solid #ced4da', borderRadius: 4, fontSize: 14, boxSizing: 'border-box', marginBottom: type === 'new' ? 12 : 0 }}
        autoFocus
        onKeyPress={(e) => handleKeyPress(e, onSubmit)}
      />
      {type === 'new' && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onSubmit} disabled={isLoading || !formData[type].trim()} style={{ padding: '8px 16px', backgroundColor: isLoading || !formData[type].trim() ? '#ccc' : '#007bff', color: 'white', border: 'none', borderRadius: 4, fontSize: 13, cursor: isLoading || !formData[type].trim() ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
            {isLoading ? '생성 중...' : '생성'}
          </button>
          <button onClick={onCancel} disabled={isLoading} style={{ padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, fontSize: 13, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            취소
          </button>
        </div>
      )}
    </div>
  );

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
          type="new"
          placeholder="과목명을 입력하세요 (예: 수학, 영어, 과학)"
          onSubmit={() => handleAction('create')}
          onCancel={() => { setIsCreating(false); setFormData(prev => ({ ...prev, new: '' })); }}
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
                  <InputForm
                    type="edit"
                    onSubmit={() => handleAction('update')}
                    onCancel={() => { setEditingId(null); setFormData(prev => ({ ...prev, edit: '' })); }}
                  />
                  <button onClick={() => handleAction('update')} disabled={isLoading || !formData.edit.trim()} style={{ padding: '6px 12px', fontSize: 12, cursor: isLoading || !formData.edit.trim() ? 'not-allowed' : 'pointer', fontWeight: 500, backgroundColor: isLoading || !formData.edit.trim() ? '#ccc' : '#28a745', color: 'white', border: 'none', borderRadius: 4 }}>
                    {isLoading ? '저장 중...' : '저장'}
                  </button>
                  <button onClick={() => { setEditingId(null); setFormData(prev => ({ ...prev, edit: '' })); }} disabled={isLoading} style={{ padding: '6px 12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: 4, fontSize: 12, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <span style={{ fontSize: 14, color: '#495057', fontWeight: 500, flex: 1 }}>
                    {subject.subjectName}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => startEdit(subject)} disabled={isLoading} style={{ padding: '4px 8px', backgroundColor: '#ffc107', color: '#212529', border: 'none', borderRadius: 3, fontSize: 11, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                      수정
                    </button>
                    <button onClick={() => handleAction('delete', subject.id, subject.subjectName)} disabled={isLoading} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: 3, fontSize: 11, cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
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