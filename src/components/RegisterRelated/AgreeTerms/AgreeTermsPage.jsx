import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AgreeTermsPage.css";

function AgreeTermsPage() {
  const navigate = useNavigate();

  const [allAgree, setAllAgree] = useState(false);
  const [agreements, setAgreements] = useState({
    terms: false,
    privacy: false,
    community: false,
    ads: false,
    realname: false,
    over14: false,
  });

  const handleAllAgree = () => {
    const newValue = !allAgree;
    setAllAgree(newValue);
    setAgreements({
      terms: newValue,
      privacy: newValue,
      community: newValue,
      ads: newValue,
      realname: newValue,
      over14: newValue,
    });
  };

  const handleSingleAgree = (key) => {
    const updated = { ...agreements, [key]: !agreements[key] };
    setAgreements(updated);
    setAllAgree(Object.values(updated).every(Boolean));
  };

  const handleNext = () => {
    if (!agreements.terms || !agreements.privacy || !agreements.community) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }
    navigate("/CreateAccount");
  };

  return (
    <>
      <div className="agreement-container">
        <h2>약관 동의</h2>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={allAgree}
            onChange={handleAllAgree}
          />
          아래 약관에 모두 동의합니다.
        </label>

        <hr />

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.terms}
            onChange={() => handleSingleAgree("terms")}
          />
          서비스 이용약관 동의 (필수)
          <div className="description-box">
            제 1조(목적)<br />
            이하 설명
          </div>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.privacy}
            onChange={() => handleSingleAgree("privacy")}
          />
          개인정보 수집 및 이용 동의 (필수)
          <div className="description-box">
            수집하는 개인정보의 목록<br />
            이하 설명
          </div>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.community}
            onChange={() => handleSingleAgree("community")}
          />
          커뮤니티 이용규칙 확인 (필수)
          <div className="description-box">
            커뮤니티 이용규칙 안내<br />
            이하 설명
          </div>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.ads}
            onChange={() => handleSingleAgree("ads")}
          />
          광고성 정보 수신 동의 (선택)
          <div className="description-box">
            다양한 맞춤형 광고성 정보가 메일로 전송됨<br />
            이하 설명
          </div>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.realname}
            onChange={() => handleSingleAgree("realname")}
          />
          본인 명의 이용 가입
          <div className="description-box">
            타인 명의 가입 할 수 없음 무조건 본인<br />
            이하 설명
          </div>
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={agreements.over14}
            onChange={() => handleSingleAgree("over14")}
          />
          만 14세 이상
          <div className="description-box">
            만 14세 이상만 가능합니다.<br />
            이하 설명
          </div>
        </label>
      </div>

      {/* 약관 박스 외부에 위치한 버튼 */}
      <div className="next-button-wrapper">
        <button className="next-button" onClick={handleNext}>
          다음으로
        </button>
      </div>
    </>
  );
}

export default AgreeTermsPage;
