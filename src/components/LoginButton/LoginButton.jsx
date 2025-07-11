import React, { useEffect, useState } from "react";
import "./LoginButton.css"; 

function LoginButton() {
  const [jwtStatus, setJwtStatus] = useState("Jwt 없음");

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
    </div>
  );
}

export default LoginButton;
