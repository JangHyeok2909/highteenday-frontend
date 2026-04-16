import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "components/Header/MainHader/Header";
import SchoolSearch from "components/RegisterRelated/School/SchoolSearch";
import "components/Default.css";
import "./SchoolChangePage.css";

const GRADES = [
  { label: "1학년", value: "SOPHOMORE" },
  { label: "2학년", value: "JUNIOR" },
  { label: "3학년", value: "SENIOR" },
];

const CLASSES = Array.from({ length: 10 }, (_, i) => i + 1);

function SchoolChangePage() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [grade, setGrade] = useState("");
  const [userClass, setUserClass] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = selectedSchool && grade && userClass;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    try {
      await axios.patch(
        "/api/user/school",
        {
          schoolId: String(selectedSchool.id),
          grade,
          userClass: Number(userClass),
        },
        { withCredentials: true }
      );
      navigate("/profile/edit");
    } catch (err) {
      console.error("학교 변경 실패:", err);
      alert(err?.response?.data?.message || "학교 정보 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="default-root-value">
      <Header isMainPage={false} />

      <div className="school-change-page">
        <Helmet><title>학교 정보 변경 | 하이틴데이</title></Helmet>
        <h2 className="school-change-title">학교 정보 변경</h2>

        {/* 학교 검색 (SchoolSearch 재사용) */}
        <SchoolSearch onSchoolSelect={setSelectedSchool} />

        {/* 선택된 학교 표시 */}
        {selectedSchool && (
          <div className="selected-school-badge">
            선택된 학교: <strong>{selectedSchool.name}</strong>
          </div>
        )}

        {/* 학년 / 반 선택 */}
        <div className="grade-class-row">
          <div className="select-group">
            <label className="select-label">학년</label>
            <select
              className="select-box"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">선택</option>
              {GRADES.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label className="select-label">반</label>
            <select
              className="select-box"
              value={userClass}
              onChange={(e) => setUserClass(e.target.value)}
            >
              <option value="">선택</option>
              {CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}반
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="school-change-actions">
          <button
            className="school-change-submit"
            onClick={handleSubmit}
            disabled={!canSubmit || loading}
          >
            {loading ? "변경 중..." : "변경하기"}
          </button>
          <button
            className="school-change-cancel"
            onClick={() => navigate("/profile/edit")}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}

export default SchoolChangePage;
