import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SchoolSearch, { School } from "../RegisterRelated/School/SchoolSearch";
import { Button, Card } from "../ui";
import "./ChangePage.css";

const GRADES = [
  { label: "1학년", value: "SOPHOMORE" },
  { label: "2학년", value: "JUNIOR" },
  { label: "3학년", value: "SENIOR" },
];

const CLASSES = Array.from({ length: 10 }, (_, i) => i + 1);

function SchoolChangePage() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [grade, setGrade] = useState("");
  const [userClass, setUserClass] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = Boolean(selectedSchool && grade && userClass);

  const handleSubmit = async () => {
    if (!canSubmit || !selectedSchool) return;
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
    } catch (err: any) {
      console.error("학교 변경 실패:", err);
      alert(err?.response?.data?.message || "학교 정보 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-page default-root-value">
      <Helmet>
        <title>학교 정보 변경 | 하이틴데이</title>
      </Helmet>
      <h1 className="change-page__title">학교 정보 변경</h1>

      <Card className="change-page__card">
        {/* 학교 검색 (SchoolSearch 재사용) */}
        <SchoolSearch onSchoolSelect={setSelectedSchool} />

        {selectedSchool && (
          <div className="change-page__school-badge">
            선택된 학교: <strong>{selectedSchool.name}</strong>
          </div>
        )}

        <div className="change-page__select-row">
          <div className="change-page__select-group">
            <label className="change-page__select-label" htmlFor="grade-select">
              학년
            </label>
            <select
              id="grade-select"
              className="change-page__select"
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

          <div className="change-page__select-group">
            <label className="change-page__select-label" htmlFor="class-select">
              반
            </label>
            <select
              id="class-select"
              className="change-page__select"
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

        <div className="change-page__actions">
          <Button
            fullWidth
            onClick={handleSubmit}
            isLoading={loading}
            disabled={!canSubmit}
          >
            변경하기
          </Button>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => navigate("/profile/edit")}
          >
            취소
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default SchoolChangePage;
