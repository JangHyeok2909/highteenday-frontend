import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { X } from "lucide-react";

import TimetableGrid from "./TimetableGrid";
import "./FriendTimetableModal.css";

const GRADE_LABELS = { SOPHOMORE: "1학년", JUNIOR: "2학년", SENIOR: "3학년" };
const SEMESTER_LABELS = { FIRST: "1학기", SECOND: "2학기" };

export default function FriendTimetableModal({ friend, onClose, onImported }) {
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [templateName, setTemplateName] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const friendName = friend.name || friend.nickname || "친구";

  const fetchDefaultTemplate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`/api/timetableTemplates/friends/${friend.id}/default`, {
        withCredentials: true,
      });
      setTemplate(data);
      setTemplateName(`${friend.name || friend.nickname}의 ${data.templateName}`);
    } catch (err) {
      console.error("친구 시간표 불러오기 실패:", err);
      setError(err?.response?.data?.message || "친구의 시간표를 불러오지 못했습니다.");
      setTemplate(null);
    } finally {
      setIsLoading(false);
    }
  }, [friend.id, friend.name, friend.nickname]);

  useEffect(() => {
    fetchDefaultTemplate();
  }, [fetchDefaultTemplate]);

  const handleImport = async () => {
    if (!templateName.trim()) return alert("템플릿 이름을 입력하세요.");

    setIsImporting(true);
    try {
      const { data } = await axios.post(
        "/api/timetableTemplates/import",
        {
          sourceTemplateId: template.id,
          templateName: templateName.trim(),
          default: setAsDefault,
        },
        { withCredentials: true, headers: { "Content-Type": "application/json" } }
      );
      alert("친구의 시간표를 내 템플릿으로 가져왔습니다.");
      if (onImported) onImported(data);
      onClose();
      navigate(`/timetable?templateId=${data.id}`);
    } catch (err) {
      console.error("시간표 가져오기 실패:", err);
      alert(err?.response?.data?.message || "시간표 가져오기에 실패했습니다.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="friend-timetable-overlay" onClick={onClose} role="presentation">
      <div className="friend-timetable-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ftm-close" onClick={onClose} aria-label="닫기">
          <X size={20} />
        </button>

        <div className="ftm-header">
          <h3 className="ftm-title">{friendName}님의 기본 시간표</h3>
          {template && (
            <div className="ftm-subtitle">
              {template.templateName} · {GRADE_LABELS[template.grade] || template.grade} /{" "}
              {SEMESTER_LABELS[template.semester] || template.semester}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="ftm-state">
            <div style={{ marginBottom: 8 }}>⏳</div>
            <p>시간표 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="ftm-error">{error}</div>
        ) : (
          <>
            <TimetableGrid timetableData={template.timetables} isEditMode={false} />

            <div className="ftm-import">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="저장할 템플릿 이름"
              />
              <label>
                <input
                  type="checkbox"
                  checked={setAsDefault}
                  onChange={(e) => setSetAsDefault(e.target.checked)}
                />
                기본 템플릿으로 설정
              </label>
              <button
                type="button"
                className="ftm-import-btn"
                onClick={handleImport}
                disabled={isImporting}
              >
                {isImporting ? "가져오는 중..." : "내 시간표로 가져오기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
