import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./SchoolVerification.css";

function SchoolSearch() {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("학교 이름을 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(
        `/api/schools/search?name=${encodeURIComponent(query)}`,
        { withCredentials: true }
      );
      setSchools(res.data);
    } catch (err) {
      console.error("학교 검색 실패:", err);
      alert("학교를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (schoolName) => {
    navigate("/CreateAccount", {
      state: { ...location.state, school: schoolName },
    });
  };

  return (
    <div className="school-search-container">
      <h2>학교 검색</h2>

      <div className="school-search-form">
        <input
          type="text"
          value={query}
          placeholder="학교 이름을 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>
      </div>

      {loading && <p>검색 중...</p>}

      {!loading && schools.length > 0 && (
        <ul className="school-list">
          {schools.map((school) => (
            <li
              key={school.id}
              onClick={() => handleSelectSchool(school.name)}
              style={{ cursor: "pointer" }}
            >
              {school.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SchoolSearch;
