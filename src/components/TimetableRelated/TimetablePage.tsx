import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import axios, { AxiosRequestConfig, Method } from "axios";
import { Lock, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import TimetableTemplateList from "./TimetableTemplateList";
import TimetableGrid from "./TimetableGrid";
import SubjectBar from "./SubjectBar";
import SubjectList from "./SubjectList";
import {
  DAY_LABELS,
  SelectedCell,
  Subject,
  TimetableEntry,
} from "./types";
import { Button, Card, EmptyState, Spinner } from "../ui";
import "./TimetablePage.css";
import "./SubjectBar.css";

const API_BASE = "/api";

export default function TimetablePage() {
  const { isLogin } = useAuth();

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(
    null
  );
  const [timetableData, setTimetableData] = useState<TimetableEntry[]>([]);
  const [allSubjects, setAllSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    day: null,
    period: null,
  });
  const [error, setError] = useState<string | null>(null);

  const apiCall = async (method: Method, url: string, data?: unknown) => {
    const config: AxiosRequestConfig = {
      method,
      url: `${API_BASE}${url}`,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };
    if (data) config.data = data;
    return axios(config);
  };

  const fetchData = async () => {
    if (!selectedTemplateId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [timetableRes, subjectsRes] = await Promise.all([
        apiCall(
          "GET",
          `/timetableTemplates/${selectedTemplateId}/userTimetables`
        ),
        apiCall("GET", `/timetableTemplates/${selectedTemplateId}/subjects`),
      ]);

      setTimetableData(
        Array.isArray(timetableRes.data) ? timetableRes.data : []
      );
      setAllSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectAction = async (
    action: "create" | "update" | "delete",
    ...args: (string | number)[]
  ) => {
    if (!selectedTemplateId) throw new Error("템플릿이 선택되지 않았습니다.");

    const endpoints: Record<
      string,
      (...a: any[]) => [Method, string, unknown?]
    > = {
      create: (name: string) => [
        "POST",
        `/timetableTemplates/${selectedTemplateId}/subjects`,
        { subjectName: name },
      ],
      update: (id: number, name: string) => [
        "PUT",
        `/timetableTemplates/${selectedTemplateId}/subjects/${id}`,
        { subjectName: name },
      ],
      delete: (id: number) => [
        "DELETE",
        `/timetableTemplates/${selectedTemplateId}/subjects/${id}`,
      ],
    };

    const [method, url, data] = endpoints[action](...args);
    await apiCall(method, url, data);
    await fetchData();
  };

  const handleAssign = async (subjectId: number, cell: SelectedCell) => {
    try {
      await apiCall(
        "POST",
        `/timetableTemplates/${selectedTemplateId}/userTimetables`,
        {
          subjectId: Number(subjectId),
          day: cell.day,
          period: String(cell.period),
        }
      );
      await fetchData();
      setSelectedCell({ day: null, period: null });
    } catch (err: any) {
      const message =
        err?.response?.status === 409
          ? "해당 시간에 이미 과목이 배정되어 있습니다."
          : "과목 할당 중 오류가 발생했습니다.";
      alert(message);
    }
  };

  const handleUnassign = async (userTimetableId: number) => {
    try {
      await apiCall(
        "DELETE",
        `/timetableTemplates/${selectedTemplateId}/userTimetables/${userTimetableId}`
      );
      await fetchData();
      setSelectedCell({ day: null, period: null });
    } catch (err: any) {
      alert(err?.response?.data?.message || "과목 제거에 실패했습니다.");
    }
  };

  const handleCellClick = (day: string, period: number) => {
    if (isEditMode) setSelectedCell({ day, period });
  };

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      if (prev) setSelectedCell({ day: null, period: null });
      return !prev;
    });
  };

  const findAssigned = () =>
    timetableData.find(
      (entry) =>
        entry.day === selectedCell.day &&
        entry.period === String(selectedCell.period)
    );

  useEffect(() => {
    if (selectedTemplateId) {
      fetchData();
    } else {
      setTimetableData([]);
      setAllSubjects([]);
      setSelectedCell({ day: null, period: null });
      setIsEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplateId]);

  return (
    <div className="tt-page default-root-value">
      <Helmet>
        <title>시간표 | 하이틴데이</title>
      </Helmet>

      {!isLogin ? (
        <EmptyState
          icon={<Lock size={36} />}
          message="로그인이 필요합니다. 상단 메뉴에서 로그인 후 이용해 주세요."
        />
      ) : (
        <div className="tt-page__layout">
          {/* 왼쪽: 템플릿 목록 */}
          <aside className="tt-page__aside">
            <TimetableTemplateList onSelectTemplate={setSelectedTemplateId} />
          </aside>

          {/* 오른쪽: 시간표/과목 */}
          <Card className="tt-page__main">
            {error && (
              <div className="tt-page__error" role="alert">
                <span>
                  <strong>오류:</strong> {error}
                </span>
                <button
                  type="button"
                  className="tt-page__error-close"
                  onClick={() => setError(null)}
                  aria-label="오류 닫기"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {selectedTemplateId ? (
              <>
                <div className="tt-page__head">
                  <h2 className="tt-page__title">시간표</h2>
                  <Button
                    size="sm"
                    variant={isEditMode ? "danger" : "primary"}
                    onClick={toggleEditMode}
                  >
                    {isEditMode ? "수정 완료" : "시간표 수정"}
                  </Button>
                </div>

                {isLoading ? (
                  <div className="tt-page__loading">
                    <Spinner size={26} />
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
                      <div className="subject-bar">
                        <h4 className="subject-bar__title">
                          선택된 시간: {DAY_LABELS[selectedCell.day]}요일,{" "}
                          {selectedCell.period}교시
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

                    <SubjectList
                      subjects={allSubjects}
                      onSubjectCreate={(name) =>
                        handleSubjectAction("create", name)
                      }
                      onSubjectUpdate={(id, name) =>
                        handleSubjectAction("update", id, name)
                      }
                      onSubjectDelete={(id) =>
                        handleSubjectAction("delete", id)
                      }
                      onRefresh={fetchData}
                    />
                  </>
                )}
              </>
            ) : (
              <EmptyState message="시간표 템플릿을 선택해주세요. 왼쪽 목록에서 템플릿을 선택하면 개인별 시간표가 표시됩니다." />
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
