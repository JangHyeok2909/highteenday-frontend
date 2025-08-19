import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";


function RegisterSchool(){

    const [query, setQuery] = useState("");
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSchool,setSelectedSchool] = useState();

    const navigate = useNavigate();
    const location = useLocation();

    // 🔹 학교 검색
    const handleSearch = async () => {
      if (!query.trim()) {
        alert("학교 이름을 입력하세요.");
        return;
      }
      setLoading(true);
      try {
        const res = await axios.get(`/api/schools/search?name=${query}`);
        setSchools(res.data);
      } catch (err) {
        console.error("학교 검색 실패:", err);
        alert("학교 검색 실패");
      } finally {
        setLoading(false);
      }
    };

    const submit= async () =>{
        try{
            const res = await axios.put(
                "/api/user/modify/school",
                {schoolId:selectedSchool.id}, 
                {withCredentials : true},
            );
            console.log("학교 업데이트 성공:", res.data);
            navigate("/register/profile")
        } catch(err){
            console.warn("학교 업데이트 실패")
        }
    }

    return (
      <div>
        <h2>학교 검색</h2>

        {/* 검색창 */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
        >
          <input
            type="text"
            value={query}
            placeholder="학교 이름을 입력하세요"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">검색</button>
        </form>

        {/* 검색 결과 */}
        {loading && <p>검색 중...</p>}
        {!loading && schools.length > 0 && (
          <ul>
            {schools.map((school) => (
              <li
                key={school.id}
                onClick={()=>setSelectedSchool(school)}
                style={{ cursor: "pointer" }}
              >
                {school.name} ({school.location})
              </li>
            ))}
          </ul>
        )}
        <button onClick={submit} disabled={!selectedSchool}>다음</button>
      </div>
    );
}

export default RegisterSchool;