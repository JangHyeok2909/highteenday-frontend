import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SchoolChange.css";

function SchoolChange() {
  const navigate = useNavigate();
  const [school, setSchool] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);  
  const [msg, setMsg] = useState(null);
  const [results, setResults] = useState([]);

  // 학교 검색
  const handleSearch = async () => {
    if (!school.trim()) {
      setMsg("학교명을 입력해 주세요.");
      return;
    }
    setMsg(null);
    setSearchLoading(true);
    try {
      const res = await axios.get(`/api/schools/search`, {
        params: { name: school.trim() },
        withCredentials: true,
      });
      setResults(res.data || []);
      if (!res.data || res.data.length === 0) {
        setMsg("검색 결과가 없습니다.");
      }
    } catch (err) {
      console.error(err);
      setMsg("검색에 실패했습니다.");
    } finally {
      setSearchLoading(false);
    }
  };

  // 학교 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!school.trim()) {
      setMsg("학교명을 입력해 주세요.");
      return;
    }
    setMsg(null);
    setSaveLoading(true);
    try {
      await axios.post(
        "/api/user/updateSchool",
        //학교 저장 api 필요
        { school: school.trim() },
        { withCredentials: true }
      );
      setMsg("학교 정보가 변경되었습니다.");

    } catch (err) {
      console.error(err);
      setMsg("학교 정보 변경에 실패했습니다.");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div id="school-change">
      {/* 상단 헤더 */}
      <header className="sc-page-header">
        <h1 className="sc-title">하이틴데이</h1>
        <hr className="sc-header-divider" />
      </header>

      {/* 본문 */}
      <main className="sc-container">
        <h2 className="sc-heading">학교 정보 변경</h2>

        <form className="sc-form" onSubmit={handleSubmit}>
          {/* 검색창 + 버튼 */}
          <div className="sc-row">
            <label className="sc-label" htmlFor="schoolInput">
              학교
            </label>
            <input
              id="schoolInput"
              className="sc-input"
              type="text"
              placeholder="학교명을 입력하세요"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
            />
            <button
              type="button"
              className="sc-search-btn"
              onClick={handleSearch}
              disabled={searchLoading}
            >
              {searchLoading ? "검색 중..." : "학교 검색"}
            </button>
          </div>

          {/* 검색 결과 */}
          {results.length > 0 && (
            <ul className="sc-results">
              {results.map((s) => (
                <li
                  key={s.id}
                  onClick={() => setSchool(s.name)}
                  className="sc-result-item"
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}

          {/* 확인 */}
          <button
            type="submit"
            className="sc-submit-btn"
            disabled={saveLoading}
          >
            {saveLoading ? "저장 중..." : "확인"}
          </button>
        </form>

        {msg && <p className="sc-message">{msg}</p>}
      </main>
    </div>
  );
}

export default SchoolChange;
