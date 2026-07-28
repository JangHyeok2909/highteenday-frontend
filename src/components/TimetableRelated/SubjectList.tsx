import React, { useState, useRef } from "react";
import { RefreshCw, Plus, BookOpen } from "lucide-react";
import { Subject } from "./types";
import { Button, EmptyState } from "../ui";
import "./TimetablePage.css";

interface InputFormProps {
  type: "new" | "edit";
  defaultValue?: string;
  placeholder?: string;
  isLoading: boolean;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

// 한글 IME 조합 문제로 uncontrolled input 유지 (제어 컴포넌트로 바꾸지 말 것)
function InputForm({
  type,
  defaultValue,
  placeholder,
  isLoading,
  onSubmit,
  onCancel,
}: InputFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = () => {
    const val = inputRef.current?.value?.trim() || "";
    if (!val) return alert("과목명을 입력해주세요.");
    onSubmit(val);
  };

  return (
    <div className="tt-subject-form">
      {type === "new" && (
        <h5 className="tt-subject-form__title">새 과목 추가</h5>
      )}
      <input
        ref={inputRef}
        type="text"
        className="tt-input"
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        disabled={isLoading}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.nativeEvent.isComposing) submit();
        }}
      />
      {type === "new" && (
        <div className="tt-subject-form__actions">
          <Button size="sm" onClick={submit} isLoading={isLoading}>
            생성
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </Button>
        </div>
      )}
    </div>
  );
}

interface SubjectListProps {
  subjects?: Subject[];
  onSubjectCreate: (name: string) => Promise<void>;
  onSubjectUpdate: (id: number, name: string) => Promise<void>;
  onSubjectDelete: (id: number) => Promise<void>;
  onRefresh?: () => void;
}

export default function SubjectList({
  subjects = [],
  onSubjectCreate,
  onSubjectUpdate,
  onSubjectDelete,
  onRefresh,
}: SubjectListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const run = async (fn: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await fn();
      onRefresh?.();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = (name: string) =>
    run(async () => {
      await onSubjectCreate(name);
      setIsCreating(false);
    });

  const handleUpdate = (name: string) =>
    run(async () => {
      if (editingId == null) return;
      await onSubjectUpdate(editingId, name);
      setEditingId(null);
    });

  const handleDelete = (id: number, name: string) =>
    run(async () => {
      if (
        !window.confirm(
          `'${name}' 과목을 삭제하시겠습니까?\n시간표에서도 함께 제거됩니다.`
        )
      )
        return;
      await onSubjectDelete(id);
    });

  return (
    <div className="tt-subjects">
      <div className="tt-subjects__head">
        <h4 className="tt-subjects__title">과목 관리 ({subjects.length}개)</h4>
        <div className="tt-subjects__head-actions">
          <Button
            size="sm"
            variant="ghost"
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCw size={13} /> 새로고침
          </Button>
          {!isCreating && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsCreating(true)}
              disabled={isLoading}
            >
              <Plus size={13} /> 과목 추가
            </Button>
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
        <EmptyState
          icon={<BookOpen size={32} />}
          message="아직 등록된 과목이 없습니다. '+ 과목 추가' 버튼을 눌러 과목을 추가해보세요!"
        />
      ) : (
        <div className="tt-subjects__list">
          {subjects.map((subject) => (
            <div key={subject.id} className="tt-subject">
              {editingId === subject.id ? (
                <div className="tt-subject__edit">
                  <InputForm
                    key={`edit-${subject.id}`}
                    type="edit"
                    defaultValue={subject.subjectName}
                    isLoading={isLoading}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <>
                  <span className="tt-subject__name">
                    {subject.subjectName}
                  </span>
                  <div className="tt-subject__actions">
                    <button
                      type="button"
                      className="tt-template__action"
                      onClick={() => setEditingId(subject.id)}
                      disabled={isLoading}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="tt-template__action tt-template__action--danger"
                      onClick={() =>
                        handleDelete(subject.id, subject.subjectName)
                      }
                      disabled={isLoading}
                    >
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
        <div className="tt-subjects__tip">
          💡 <strong>팁:</strong> 과목을 삭제하면 해당 과목이 배정된
          시간표에서도 함께 제거됩니다.
        </div>
      )}
    </div>
  );
}
