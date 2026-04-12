import React, { useState, useEffect } from "react";
import axios from "axios";

import Header from "components/Header/MainHader/Header";
import "components/Default.css";

import { useAuth } from "../../contexts/AuthContext";

import TimetableTemplateList from "./TimetableTemplateList";
import TimetableGrid from "./TimetableGrid";
import SubjectBar from "./SubjectBar";
import SubjectList from "./SubjectList";
import "./SubjectBar.css";

const API_BASE = "/api";

export default function TimetablePage() {
  const { isLogin } = useAuth();

  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCell, setSelectedCell] = useState({ day: null, period: null });
  const [error, setError] = useState(null);

  const apiCall = async (method, url, data = null) => {
    const config = {
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
        apiCall("GET", `/timetableTemplates/${selectedTemplateId}/userTimetables`),
        apiCall("GET", `/timetableTemplates/${selectedTemplateId}/subjects`),
      ]);

      setTimetableData(Array.isArray(timetableRes.data) ? timetableRes.data : []);
      setAllSubjects(Array.isArray(subjectsRes.data) ? subjectsRes.data : []);
    } catch (err) {
      console.error("데이터 조회 실패:", err);
      setError("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubjectAction = async (action, ...args) => {
    if (!selectedTemplateId) throw new Error("템플릿이 선택되지 않았습니다.");

    const endpoints = {
      create: (name) => ["POST", `/timetableTemplates/${selectedTemplateId}/subjects`, { subjectName: name }],
      update: (id, name) => ["PUT", `/timetableTemplates/${selectedTemplateId}/subjects/${id}`, { subjectName: name }],
      delete: (id) => ["DELETE", `/timetableTemplates/${selectedTemplateId}/subjects/${id}`],
    };

    const [method, url, data] = endpoints[action](...args);
    await apiCall(method, url, data);
    await fetchData();
  };

  const handleAssign = async (subjectId, cell) => {
    try {
      await apiCall("POST", `/timetableTemplates/${selectedTemplateId}/userTimetables`, {
        subjectId: Number(subjectId),
        day: cell.day,
        period: String(cell.period),
      });
      await fetchData();
      setSelectedCell({ day: null, period: null });
    } catch (err) {
      const message =
        err?.response?.status === 409
          ? "해당 시간에 이미 과목이 배정되어 있습니다."
          : "과목 할당 중 오류가 발생했습니다.";
      alert(message);
    }
  };

  const handleUnassign = async (userTimetableId) => {
    try {
      await apiCall("DELETE", `/timetableTemplates/${selectedTemplateId}/userTimetables/${userTimetableId}`);
      await fetchData();
      setSelectedCell({ day: null, period: null });
    } catch {
      alert("과목 제거에 실패했습니다.");
    }
  };

  const handleCellClick = (day, period) => isEditMode && setSelectedCell({ day, period });

  const toggleEditMode = () => {
    setIsEditMode((prev) => {
      if (prev) setSelectedCell({ day: null, period: null });
      return !prev;
    });
  };

  const findAssigned = () =>
    timetableData.find((entry) => entry.day === selectedCell.day && entry.period === String(selectedCell.period));

  const getDayLabel = (day) => {
    const labels = { MONDAY: "월", TUESDAY: "화", WEDNESDAY: "수", THURSDAY: "목", FRIDAY: "금" };
    return labels[day] || day;
    };

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
    <div id="TimetablePage" className="default-root-value">
      <div className="content-container">
        <div className="header">
          <Header isMainPage={false} />
        </div>

        <div className="body">
          {!isLogin ? (
            <div style={{ padding: 32, textAlign: "center", color: "#6c757d" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
              <h3 style={{ margin: 0 }}>로그인이 필요합니다.</h3>
              <p style={{ marginTop: 8 }}>상단 메뉴에서 로그인 후 이용해 주세요.</p>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 16, padding: 16, minHeight: "70vh" }}>
              {/* 왼쪽: 템플릿 목록 */}
              <aside style={{ width: 300, background: "#f8f9fa", padding: 16, borderRadius: 8 }}>
                <TimetableTemplateList onSelectTemplate={setSelectedTemplateId} />
              </aside>

              {/* 오른쪽: 시간표/과목 */}
              <main style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 8 }}>
                {error && (
                  <div
                    style={{
                      marginBottom: 16,
                      padding: 12,
                      backgroundColor: "#f8d7da",
                      border: "1px solid #f5c6cb",
                      borderRadius: 4,
                      color: "#721c24",
                    }}
                  >
                    <strong>오류:</strong> {error}
                    <button
                      onClick={() => setError(null)}
                      style={{
                        float: "right",
                        background: "none",
                        border: "none",
                        color: "#721c24",
                        cursor: "pointer",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}

                {selectedTemplateId ? (
                  <>
                    <div
                      style={{
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        paddingBottom: 16,
                      }}
                    >
                      <h2 style={{ margin: 0, color: "#333" }}>시간표 (템플릿 ID: {selectedTemplateId})</h2>
                      <button
                        onClick={toggleEditMode}
                        style={{
                          padding: "8px 16px",
                          color: "white",
                          border: "none",
                          borderRadius: 4,
                          cursor: "pointer",
                          fontWeight: 500,
                          backgroundColor: isEditMode ? "#dc3545" : "#007bff",
                        }}
                      >
                        {isEditMode ? "수정 완료" : "시간표 수정"}
                      </button>
                    </div>

                    {isLoading ? (
                      <div style={{ textAlign: "center", padding: 40, color: "#6c757d" }}>
                        <div style={{ marginBottom: 8 }}>⏳</div>
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
                            <h4 style={{ margin: "0 0 12px 0", color: "#495057", fontSize: 16 }}>
                              선택된 시간: {getDayLabel(selectedCell.day)}요일, {selectedCell.period}교시
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
                          onSubjectCreate={(name) => handleSubjectAction("create", name)}
                          onSubjectUpdate={(id, name) => handleSubjectAction("update", id, name)}
                          onSubjectDelete={(id) => handleSubjectAction("delete", id)}
                          onRefresh={fetchData}
                        />
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: 60, color: "#6c757d" }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
                    <h3 style={{ marginBottom: 8 }}>시간표 템플릿을 선택해주세요</h3>
                    <p>왼쪽 목록에서 템플릿을 선택하면 개인별 시간표가 표시됩니다.</p>
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
