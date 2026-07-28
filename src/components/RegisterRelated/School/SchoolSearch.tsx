import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Search } from "lucide-react";
import { Button, Card, Input, Spinner } from "../../ui";
import "./SchoolSearch.css";

export interface School {
  id: number;
  name: string;
  location: string;
}

interface SchoolSearchProps {
  /** 외부에서 선택 상태를 제어할 때 사용 (제공 시 submit 버튼 숨김) */
  onSchoolSelect?: (school: School) => void;
}

function SchoolSearch({ onSchoolSelect }: SchoolSearchProps) {
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const navigate = useNavigate();

  const isControlled = typeof onSchoolSelect === "function";

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get<School[]>(`/api/schools/search?name=${query}`);
      setSchools(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (school: School) => {
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
    <Card className="school-search">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="school-search__form"
      >
        <Input
          type="text"
          value={query}
          placeholder="학교 이름을 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">
          <Search size={15} /> 검색
        </Button>
      </form>

      {loading && (
        <div className="school-search__loading">
          <Spinner size={22} />
        </div>
      )}

      {!loading && schools.length > 0 && (
        <ul className="school-search__list">
          {schools.map((school) => (
            <li key={school.id}>
              <button
                type="button"
                className={`school-search__item ${
                  selectedSchool?.id === school.id
                    ? "school-search__item--selected"
                    : ""
                }`}
                onClick={() => handleSelect(school)}
              >
                <span className="school-search__name">{school.name}</span>
                <span className="school-search__location">
                  {school.location}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 외부에서 제어하지 않을 때만 내부 submit 버튼 표시 */}
      {!isControlled && (
        <Button
          fullWidth
          size="lg"
          onClick={submit}
          disabled={!selectedSchool}
          className="school-search__submit"
        >
          다음
        </Button>
      )}
    </Card>
  );
}

export default SchoolSearch;
