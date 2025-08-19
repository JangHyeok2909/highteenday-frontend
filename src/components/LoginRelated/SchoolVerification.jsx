import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SchoolVerification.css";

function SchoolVerification() {
  const [schools, setSchools] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    axios
      .get("/api/schools") // 실제 API 주소로 변경
      .then((res) => setSchools(res.data))
      .catch((err) => console.error("학교 리스트 로드 실패:", err));
  }, []);

  const handleSendCode = () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    axios
      .post("/api/send-verification-code", {
        email: email,
        school: selectedSchool,
      })
      .then(() => {
        alert("인증 코드가 전송되었습니다.");
        setCodeSent(true);
      })
      .catch(() => alert("인증 코드 전송 실패"));
  };

  const handleSelectSchool = (school) => {
    navigate("/CreateAccount", {
      state: { 
        ...location.state, 
        school: school,
       },
    });
  };

  return (
    <div className="school-search-container">
      <h2>학교 검색</h2>
      <form          
      onSubmit={(e) => {
        e.preventDefault();  // 기본 새로고침 방지
        handleSearch()
        // 🔹 여기서 서버 요청이나 검색 함수 실행        
        }}
      >
      <div className="school-search-form">          
        <input           
          type="text"
          value={query}
          placeholder="학교 이름을 입력하세요"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch} >검색</button>
        
      </div>
      </form>

      <div className="school-form-group">
        <label>학교 이메일 주소</label>
        <input
          type="email"
          value={email}
          placeholder="HighteenDay@example.com"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      {!loading && schools.length > 0 && (
        <ul className="school-list">
          {schools.map((school) => (
            <li
              key={school.id}
              onClick={() => handleSelectSchool(school)}
              style={{ cursor: "pointer" }}
            >
              {school.name}({school.location})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SchoolVerification;
