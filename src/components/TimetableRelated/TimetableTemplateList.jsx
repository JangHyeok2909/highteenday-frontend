import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GRADES = [
  { value: 'SOPHOMORE', label: '1학년' },
  { value: 'JUNIOR',    label: '2학년' },
  { value: 'SENIOR',    label: '3학년' },
];
const SEMESTERS = [
  { value: 'FIRST',  label: '1학기' },
  { value: 'SECOND', label: '2학기' },
];

function TimetableTemplateList({ onSelectTemplate }) {
  const [templates, setTemplates] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('SOPHOMORE');
  const [newSemester, setNewSemester] = useState('FIRST');
  const [newDefault, setNewDefault] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState('SOPHOMORE');
  const [editSemester, setEditSemester] = useState('FIRST');
  const [editDefault, setEditDefault] = useState(false);

  const API_BASE = '/api';

  const fetchTemplates = () => {
    axios
      .get(`${API_BASE}/timetableTemplates`, { withCredentials: true })
      .then(res => {
        let templates = Array.isArray(res.data) ? res.data : [];
        
        templates = templates.sort((a, b) => {
          if (a.default && !b.default) return -1;
          if (!a.default && b.default) return 1;
          return 0;
        });
        
        setTemplates(templates);
        
        if (templates.length > 0 && !templates.find(t => t.id === selectedId)) {
          const defaultTemplate = templates.find(t => t.default);
          const templateToSelect = defaultTemplate || templates[0];
          setSelectedId(templateToSelect.id);
          onSelectTemplate(templateToSelect.id);
        }
      })
      .catch(err => {
        console.error('템플릿 불러오기 실패:', err);
        setTemplates([]);
      });
  };

  useEffect(fetchTemplates, [onSelectTemplate, selectedId]);

  function handleCreate() {
    if (!newName.trim()) return alert('템플릿 이름을 입력하세요');

    axios.post(
      `${API_BASE}/timetableTemplates`,
      {
        templateName: newName.trim(),
        grade: newGrade,
        semester: newSemester,
        default: newDefault
      },
      { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      setNewName('');
      setNewGrade('SOPHOMORE');
      setNewSemester('FIRST');
      setNewDefault(false);
      fetchTemplates();
      alert('템플릿이 성공적으로 생성되었습니다!');
    })
    .catch(err => {
      console.error('템플릿 생성 실패:', err);
      alert('템플릿 생성에 실패했습니다.');
    });
  }

  // 템플릿 선택
  const handleClick = id => {
    setSelectedId(id);
    onSelectTemplate(id);
  };

  const handleDelete = id => {
    if (!window.confirm('정말 이 템플릿을 삭제하시겠습니까?\n관련된 모든 시간표 데이터가 함께 삭제됩니다.')) return;
    
    if (id === selectedId) {
      setSelectedId(null);
      onSelectTemplate(null);
    }

    axios
      .delete(`${API_BASE}/timetableTemplates/${id}`, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        fetchTemplates();
        alert('템플릿이 성공적으로 삭제되었습니다.');
      })
      .catch(err => {
        console.error('템플릿 삭제 실패:', err);
        alert('템플릿 삭제에 실패했습니다.');
      });
  };

  // 수정 모드 진입
  const startEdit = tpl => {
    setEditingId(tpl.id);
    setEditName(tpl.templateName);
    setEditGrade(tpl.grade);
    setEditSemester(tpl.semester);
    setEditDefault(tpl.default || false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditGrade('SOPHOMORE');
    setEditSemester('FIRST');
    setEditDefault(false);
  };

  // 템플릿 수정
  const handleSave = id => {
    if (!editName.trim()) return alert('템플릿 이름을 입력하세요.');
    
    axios
      .put(
        `${API_BASE}/timetableTemplates/${id}`,
        { 
          templateName: editName.trim(), 
          grade: editGrade, 
          semester: editSemester,
          default: editDefault
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      .then((response) => {
        setEditingId(null);
        fetchTemplates();
        alert('템플릿이 성공적으로 수정되었습니다!');
      })
      .catch(err => {
        console.error('템플릿 수정 실패:', err);
        alert('템플릿 수정에 실패했습니다.');
      });
  };

  return (
    <div>
      <h3 style={{ 
        marginBottom: 16, 
        color: '#495057',
        fontSize: 18,
        fontWeight: 600
      }}>
        시간표 템플릿
      </h3>
      
      <div style={{ marginBottom: 20 }}>
        {templates.length === 0 ? (
          <div style={{
            padding: 16,
            textAlign: 'center',
            color: '#6c757d',
            fontSize: 14,
            border: '1px dashed #dee2e6',
            borderRadius: 4
          }}>
            템플릿이 없습니다
          </div>
        ) : (
          templates.map(tpl => (
            <div
              key={tpl.id}
              style={{
                marginBottom: 8,
                padding: 12,
                border: tpl.id === selectedId ? '2px solid #007bff' : '1px solid #dee2e6',
                borderRadius: 6,
                background: tpl.id === selectedId ? '#e3f2fd' : '#fff',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {/* 기본 템플릿 표시 */}
              {tpl.default && (
                <div style={{
                  position: 'absolute',
                  top: -8,
                  left: 8,
                  backgroundColor: '#28a745',
                  color: 'white',
                  fontSize: 10,
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontWeight: 'bold'
                }}>
                  기본
                </div>
              )}

              {editingId === tpl.id ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="템플릿 이름"
                    style={{
                      padding: 8,
                      border: '1px solid #dee2e6',
                      borderRadius: 4,
                      fontSize: 14
                    }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select
                      value={editGrade}
                      onChange={e => setEditGrade(e.target.value)}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #dee2e6',
                        borderRadius: 4,
                        fontSize: 14
                      }}
                    >
                      {GRADES.map(g => (
                        <option key={g.value} value={g.value}>{g.label}</option>
                      ))}
                    </select>
                    <select
                      value={editSemester}
                      onChange={e => setEditSemester(e.target.value)}
                      style={{
                        flex: 1,
                        padding: 8,
                        border: '1px solid #dee2e6',
                        borderRadius: 4,
                        fontSize: 14
                      }}
                    >
                      {SEMESTERS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 4,
                      fontSize: 14,
                      color: '#495057'
                    }}>
                      <input
                        type="checkbox"
                        checked={editDefault}
                        onChange={e => setEditDefault(e.target.checked)}
                      />
                      기본 템플릿으로 설정
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => handleSave(tpl.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      저장
                    </button>
                    <button 
                      onClick={cancelEdit}
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
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    onClick={() => handleClick(tpl.id)}
                    style={{ cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{ 
                      fontWeight: 600, 
                      fontSize: 14,
                      color: '#495057',
                      marginBottom: 4
                    }}>
                      {tpl.templateName}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#6c757d' 
                    }}>
                      {GRADES.find(g => g.value === tpl.grade)?.label} /{' '}
                      {SEMESTERS.find(s => s.value === tpl.semester)?.label}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={() => startEdit(tpl)}
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
                      onClick={() => handleDelete(tpl.id)}
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
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div style={{ 
        borderTop: '1px solid #dee2e6', 
        paddingTop: 16 
      }}>
        <h4 style={{ 
          margin: '0 0 12px 0',
          fontSize: 14,
          color: '#495057',
          fontWeight: 600
        }}>
          새 템플릿 추가
        </h4>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="템플릿 이름"
          style={{ 
            width: '100%', 
            marginBottom: 8,
            padding: 8,
            border: '1px solid #dee2e6',
            borderRadius: 4,
            fontSize: 14,
            boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <select
            value={newGrade}
            onChange={e => setNewGrade(e.target.value)}
            style={{ 
              flex: 1,
              padding: 8,
              border: '1px solid #dee2e6',
              borderRadius: 4,
              fontSize: 14
            }}
          >
            {GRADES.map(g => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
          <select
            value={newSemester}
            onChange={e => setNewSemester(e.target.value)}
            style={{ 
              flex: 1,
              padding: 8,
              border: '1px solid #dee2e6',
              borderRadius: 4,
              fontSize: 14
            }}
          >
            {SEMESTERS.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: 8 }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8,
            fontSize: 14,
            color: '#495057'
          }}>
            <input
              type="checkbox"
              checked={newDefault}
              onChange={e => setNewDefault(e.target.checked)}
            />
            기본 템플릿으로 설정
          </label>
        </div>
        
        <button
          onClick={handleCreate}
          style={{ 
            width: '100%',
            padding: 10,
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          템플릿 추가
        </button>
      </div>
    </div>
  );
}

export default TimetableTemplateList;