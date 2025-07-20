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

  const handleVerify = () => {
    axios
      .post("/api/verify-code", {
        email: email,
        code: verificationCode,
      })
      .then(() => {
        alert("인증 완료되었습니다.");
        setVerified(true);
      })
      .catch(() => alert("인증 실패. 코드를 다시 확인하세요."));
  };

  return (
    <div className="school-verification-container">
      <h2>학교 이메일 인증</h2>

      <div className="school-form-group">
        <label>학교 선택</label>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          required
        >
          <option value="">학교를 선택하세요</option>
          {Array.isArray(schools) &&
            schools.map((school) => (
              <option key={school.id} value={school.name}>
                {school.name}
              </option>
            ))}
        </select>
      </div>

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

      <button className="verify-button" onClick={handleSendCode}>
        인증 코드 전송
      </button>

      {codeSent && (
        <>
          <div className="school-form-group">
            <label>인증 코드 입력</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <button className="verify-button" onClick={handleVerify}>
            코드 확인
          </button>
        </>
      )}

      {verified && (
        <p className="verified-text">인증 완료</p>
      )}
    </div>
  );
}

export default SchoolVerification;
