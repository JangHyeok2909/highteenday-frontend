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

  // 신규 생성용
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState('SOPHOMORE');
  const [newSemester, setNewSemester] = useState('FIRST');

  // 수정 모드용 - 🔧 초기값 수정
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editGrade, setEditGrade] = useState('SOPHOMORE'); // FRESHMAN → SOPHOMORE
  const [editSemester, setEditSemester] = useState('FIRST');

  // API로부터 템플릿 목록 불러오기
  const fetchTemplates = () => {
    axios
      .get('/api/timetableTemplates', { withCredentials: true })
      .then(res => {
        console.log('템플릿 목록:', res.data);
        setTemplates(Array.isArray(res.data) ? res.data : []);
        
        // 최초 로드 혹은 삭제 후 선택이 사라졌을 때
        if (res.data.length > 0 && !res.data.find(t => t.id === selectedId)) {
          const first = res.data[0].id;
          setSelectedId(first);
          onSelectTemplate(first);
        }
      })
      .catch(err => {
        console.error('템플릿 불러오기 실패:', err);
        setTemplates([]);
      });
  };

  useEffect(fetchTemplates, [onSelectTemplate, selectedId]);

  // 🔧 수정: 원래 작동하던 query string 방식으로 되돌림
  function handleCreate() {
    if (!newName.trim()) return alert('템플릿 이름을 입력하세요');

    // 원래 작동하던 query string 방식 사용
    axios.post(
      `/api/timetableTemplates?templateName=${encodeURIComponent(newName.trim())}&grade=${newGrade}&semester=${newSemester}`,
      null, // 바디는 비워둠
      { withCredentials: true }
    )
    .then(() => {
      setNewName('');
      setNewGrade('SOPHOMORE');
      setNewSemester('FIRST');
      fetchTemplates(); // 리스트 새로 불러오기
    })
    .catch(err => {
      console.error('템플릿 생성 실패:', err);
      alert('템플릿 생성 중 오류가 발생했습니다.');
    });
  }

  // 템플릿 선택
  const handleClick = id => {
    setSelectedId(id);
    onSelectTemplate(id);
  };

  // 템플릿 삭제
  const handleDelete = id => {
    if (!window.confirm('정말 이 템플릿을 삭제하시겠습니까?')) return;
    axios
      .delete(`/api/timetableTemplates/${id}`, { withCredentials: true })
      .then(() => {
        if (id === selectedId) {
          setSelectedId(null);
          onSelectTemplate(null);
        }
        fetchTemplates();
      })
      .catch(err => {
        console.error('템플릿 삭제 실패:', err);
        alert('템플릿 삭제 중 오류가 발생했습니다.');
      });
  };

  // 수정 모드 진입
  const startEdit = tpl => {
    setEditingId(tpl.id);
    setEditName(tpl.templateName);
    setEditGrade(tpl.grade);
    setEditSemester(tpl.semester);
  };

  // 수정 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditGrade('SOPHOMORE');
    setEditSemester('FIRST');
  };

  // 수정 저장
  const handleSave = id => {
    if (!editName.trim()) return alert('템플릿 이름을 입력하세요.');
    axios
      .put(
        `/api/timetableTemplates/${id}`,
        { 
          templateName: editName.trim(), 
          grade: editGrade, 
          semester: editSemester 
        },
        { withCredentials: true }
      )
      .then(() => {
        setEditingId(null);
        fetchTemplates();
      })
      .catch(err => {
        console.error('템플릿 수정 실패:', err);
        alert('템플릿 수정 중 오류가 발생했습니다.');
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
      
      {/* 템플릿 목록 */}
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
                transition: 'all 0.2s ease'
              }}
            >
              {editingId === tpl.id ? (
                // **수정 모드**
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
                // **일반 모드**
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

      {/* 신규 템플릿 추가 영역 */}
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