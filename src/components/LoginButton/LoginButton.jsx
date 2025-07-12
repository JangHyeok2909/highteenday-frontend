import React, { useEffect, useState } from "react";
import "./LoginButton.css";

function LoginButton() {
  const [jwtStatus, setJwtStatus] = useState("Jwt 없음");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    fetch("https://highteenday.duckdns.org/api/user", {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (response.ok) {
          setJwtStatus("Jwt 작동 중 (로그인 상태)");
        } else {
          setJwtStatus("Jwt 없음 (비로그인 상태)");
        }
      })
      .catch(error => {
        setJwtStatus("오류 발생");
      });
  }, []);

  /*아이디 비밀번호 입력*/
  const handleLogin = () => {
    console.log("ID:", id);
    console.log("PW:", pw);
    alert(`로그인 시도: ${id}`);
  };

  /* 카카오 네이버 구글 로그인 */
  return (
    <div>
      {/* 로고 */}
      <header className="logo-header">
        <img
          src="/images/mainLogo.png"
          alt="메인 로고"
          className="logo-img"
        />
      </header>

      {/* 로그인 */}
      <div className="login-wrapper">
        <h2 className="login-title">회원 로그인</h2>
        <p className="jwt-status">{jwtStatus}</p>

        {/* 소셜 로그인 + 일반 로그인 양옆 배치 */}
        <div className="login-content">
          {/* 소셜 로그인 */}
          <div className="social-login">
            <a href="https://highteenday.duckdns.org/oauth2/authorization/naver">
              <img
                src="/images/navLogin.png"
                alt="네이버 로그인"
                className="login-button"
              />
            </a>

            <a href="https://highteenday.duckdns.org/oauth2/authorization/kakao">
              <img
                src="/images/kakaLogo.png"
                alt="카카오 로그인"
                className="login-button"
              />
            </a>

            <a href="https://highteenday.duckdns.org/oauth2/authorization/google">
              <img
                src="/images/googLogin.png"
                alt="구글 로그인"
                className="login-button"
              />
            </a>
          </div>

          {/* 일반 로그인 입력 */}
          <div className="idpw-login">
            <input
              type="text"
              placeholder="아이디"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="input-box"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="input-box"
            />
            <button className="submit-button" onClick={handleLogin}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginButton;
