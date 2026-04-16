import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SchoolSearch.css";

// onSchoolSelect: 외부에서 선택 상태를 제어할 때 사용 (제공 시 submit 버튼 숨김)
function SchoolSearch({ onSchoolSelect }) {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const navigate = useNavigate();

  const isControlled = typeof onSchoolSelect === "function";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/schools/search?name=${query}`);
      setSchools(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (school) => {
    setSelectedSchool(school);
    if (isControlled) {
      onSchoolSelect(school);
    }
  };

  const submit = async () => {
    if (!selectedSchool) return;
    try {
      await axios.patch(
        "/api/user/school",
        { schoolId: selectedSchool.id },
        { withCredentials: true }
      );
      navigate("/register/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="school-search">
      <div className="school-search-container">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="search-form"
        >
          <input
            type="text"
            value={query}
            placeholder="학교 이름을 입력하세요"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        {loading && <p className="loading-text">검색 중...</p>}

        {!loading && schools.length > 0 && (
          <ul className="school-list">
            {schools.map((school) => (
              <li
                key={school.id}
                className={selectedSchool?.id === school.id ? "selected" : ""}
                onClick={() => handleSelect(school)}
              >
                {school.name} ({school.location})
              </li>
            ))}
          </ul>
        )}

        {/* 외부에서 제어하지 않을 때만 내부 submit 버튼 표시 */}
        {!isControlled && (
          <div className="button-container">
            <button
              className="submit-button"
              onClick={submit}
              disabled={!selectedSchool}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchoolSearch;
