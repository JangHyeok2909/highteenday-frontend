import React, { useEffect, useState } from "react";
import axios from "axios";
import { GRADES, SEMESTERS, TimetableTemplate } from "./types";
import { Badge, Button } from "../ui";
import "./TimetablePage.css";

const API_BASE = "/api";

interface TimetableTemplateListProps {
  onSelectTemplate: (id: number | null) => void;
}

function TimetableTemplateList({ onSelectTemplate }: TimetableTemplateListProps) {
  const [templates, setTemplates] = useState<TimetableTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState("SOPHOMORE");
  const [newSemester, setNewSemester] = useState("FIRST");
  const [newDefault, setNewDefault] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editGrade, setEditGrade] = useState("SOPHOMORE");
  const [editSemester, setEditSemester] = useState("FIRST");
  const [editDefault, setEditDefault] = useState(false);

  const fetchTemplates = () => {
    axios
      .get<TimetableTemplate[]>(`${API_BASE}/timetableTemplates`, {
        withCredentials: true,
      })
      .then((res) => {
        let list = Array.isArray(res.data) ? res.data : [];

        list = list.sort((a, b) => {
          if (a.default && !b.default) return -1;
          if (!a.default && b.default) return 1;
          return 0;
        });

        setTemplates(list);

        if (list.length > 0 && !list.find((t) => t.id === selectedId)) {
          const defaultTemplate = list.find((t) => t.default);
          const templateToSelect = defaultTemplate || list[0];
          setSelectedId(templateToSelect.id);
          onSelectTemplate(templateToSelect.id);
        }
      })
      .catch((err) => {
        console.error("템플릿 불러오기 실패:", err);
        setTemplates([]);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchTemplates, [onSelectTemplate, selectedId]);

  function handleCreate() {
    if (!newName.trim()) return alert("템플릿 이름을 입력하세요");

    axios
      .post(
        `${API_BASE}/timetableTemplates`,
        {
          templateName: newName.trim(),
          grade: newGrade,
          semester: newSemester,
          default: newDefault,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => {
        setNewName("");
        setNewGrade("SOPHOMORE");
        setNewSemester("FIRST");
        setNewDefault(false);
        fetchTemplates();
        alert("템플릿이 성공적으로 생성되었습니다!");
      })
      .catch((err) => {
        console.error("템플릿 생성 실패:", err);
        alert(err?.response?.data?.message || "템플릿 생성에 실패했습니다.");
      });
  }

  const handleClick = (id: number) => {
    setSelectedId(id);
    onSelectTemplate(id);
  };

  const handleDelete = (id: number) => {
    if (
      !window.confirm(
        "정말 이 템플릿을 삭제하시겠습니까?\n관련된 모든 시간표 데이터가 함께 삭제됩니다."
      )
    )
      return;

    if (id === selectedId) {
      setSelectedId(null);
      onSelectTemplate(null);
    }

    axios
      .delete(`${API_BASE}/timetableTemplates/${id}`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        fetchTemplates();
        alert("템플릿이 성공적으로 삭제되었습니다.");
      })
      .catch((err) => {
        console.error("템플릿 삭제 실패:", err);
        alert(err?.response?.data?.message || "템플릿 삭제에 실패했습니다.");
      });
  };

  const startEdit = (tpl: TimetableTemplate) => {
    setEditingId(tpl.id);
    setEditName(tpl.templateName);
    setEditGrade(tpl.grade);
    setEditSemester(tpl.semester);
    setEditDefault(tpl.default || false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditGrade("SOPHOMORE");
    setEditSemester("FIRST");
    setEditDefault(false);
  };

  const handleSave = (id: number) => {
    if (!editName.trim()) return alert("템플릿 이름을 입력하세요.");

    axios
      .put(
        `${API_BASE}/timetableTemplates/${id}`,
        {
          templateName: editName.trim(),
          grade: editGrade,
          semester: editSemester,
          default: editDefault,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(() => {
        setEditingId(null);
        fetchTemplates();
        alert("템플릿이 성공적으로 수정되었습니다!");
      })
      .catch((err) => {
        console.error("템플릿 수정 실패:", err);
        alert(err?.response?.data?.message || "템플릿 수정에 실패했습니다.");
      });
  };

  return (
    <div className="tt-templates">
      <h3 className="tt-templates__title">시간표 템플릿</h3>

      <div className="tt-templates__list">
        {templates.length === 0 ? (
          <div className="tt-templates__empty">템플릿이 없습니다</div>
        ) : (
          templates.map((tpl) => (
            <div
              key={tpl.id}
              className={`tt-template ${
                tpl.id === selectedId ? "tt-template--selected" : ""
              }`}
            >
              {tpl.default && (
                <Badge tone="primary" className="tt-template__default">
                  기본
                </Badge>
              )}

              {editingId === tpl.id ? (
                <div className="tt-template__edit">
                  <input
                    className="tt-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="템플릿 이름"
                  />
                  <div className="tt-template__selects">
                    <select
                      className="tt-select"
                      value={editGrade}
                      onChange={(e) => setEditGrade(e.target.value)}
                    >
                      {GRADES.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label}
                        </option>
                      ))}
                    </select>
                    <select
                      className="tt-select"
                      value={editSemester}
                      onChange={(e) => setEditSemester(e.target.value)}
                    >
                      {SEMESTERS.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label className="tt-checkbox">
                    <input
                      type="checkbox"
                      checked={editDefault}
                      onChange={(e) => setEditDefault(e.target.checked)}
                    />
                    기본 템플릿으로 설정
                  </label>
                  <div className="tt-template__edit-actions">
                    <Button size="sm" onClick={() => handleSave(tpl.id)}>
                      저장
                    </Button>
                    <Button size="sm" variant="secondary" onClick={cancelEdit}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="tt-template__row">
                  <button
                    type="button"
                    className="tt-template__info"
                    onClick={() => handleClick(tpl.id)}
                  >
                    <span className="tt-template__name">{tpl.templateName}</span>
                    <span className="tt-template__sub">
                      {GRADES.find((g) => g.value === tpl.grade)?.label} /{" "}
                      {SEMESTERS.find((s) => s.value === tpl.semester)?.label}
                    </span>
                  </button>
                  <div className="tt-template__actions">
                    <button
                      type="button"
                      className="tt-template__action"
                      onClick={() => startEdit(tpl)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="tt-template__action tt-template__action--danger"
                      onClick={() => handleDelete(tpl.id)}
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

      <div className="tt-templates__create">
        <h4 className="tt-templates__create-title">새 템플릿 추가</h4>
        <input
          className="tt-input"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="템플릿 이름"
        />
        <div className="tt-template__selects">
          <select
            className="tt-select"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
          >
            {GRADES.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          <select
            className="tt-select"
            value={newSemester}
            onChange={(e) => setNewSemester(e.target.value)}
          >
            {SEMESTERS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <label className="tt-checkbox">
          <input
            type="checkbox"
            checked={newDefault}
            onChange={(e) => setNewDefault(e.target.checked)}
          />
          기본 템플릿으로 설정
        </label>

        <Button fullWidth onClick={handleCreate}>
          템플릿 추가
        </Button>
      </div>
    </div>
  );
}

export default TimetableTemplateList;
