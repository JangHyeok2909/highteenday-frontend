import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LoginButton.css";
import { Link } from "react-router-dom";

function LoginButton() {
  const [jwtStatus, setJwtStatus] = useState("Jwt 없음");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  const getJwtStatus = async () => {
    try {
      const res = await axios.get("/api/user/loginUser", {
        withCredentials: true,
      });
      setJwtStatus("Jwt 작동 중 (로그인 상태)");
      setUserInfo(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setJwtStatus("Jwt 없음 (비로그인 상태)");
        setUserInfo(null);
      } else {
        setJwtStatus("오류 발생");
        setUserInfo(null);
      }
    }
  };

  const logoutHandler = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      console.log("로그아웃 성공");
      setUserInfo(null);
      setJwtStatus("Jwt 없음 (비로그인 상태)");
    } catch (err) {
      console.log("로그아웃 실패", err);
    }
  };

  useEffect(() => {
    fetch("/api/user", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setJwtStatus("Jwt 작동 중 (로그인 상태)");
        } else {
          setJwtStatus("Jwt 없음 (비로그인 상태)");
        }
      })
      .catch((error) => {
        setJwtStatus("오류 발생");
      });

    getJwtStatus();
  }, []);



  /*아이디 비밀번호 입력*/
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        await axios.post("https://highteenday.duckdns.org/api/user/login",
            {
                email: id,
                password: pw
            },
            {
                withCredentials: true,
            }
        )
    } catch (err){
        console.log("로그인 실패: " + err);
    }

    alert(`로그인 시도: ${id}`);
  };

  return (
    <div>
      {/* 로고 */}
      <header className="logo-header">
        <img src="/images/highteenLogo.jpg" alt="메인 로고" className="logo-img" />
      </header>

      {/* 로그인 */}
      <div className="login-wrapper">
        <h2 className="login-title">회원 로그인</h2>
        <p className="jwt-status">{jwtStatus}</p>

        <div className="login-content">
          {/* 소셜 로그인 */}
          <div className="social-login">
            <a href="/oauth2/authorization/naver">
              <img src="/images/navLogin.png" alt="네이버 로그인" className="login-button" />
            </a>
            <a href="/oauth2/authorization/kakao">
              <img src="/images/kakaLogo.png" alt="카카오 로그인" className="login-button" />
            </a>
            <a href="/oauth2/authorization/google">
              <img src="/images/googLogin.png" alt="구글 로그인" className="login-button" />
            </a>
          </div>

          {/* 일반 로그인 */}
          <div className="idpw-login">
            <form onSubmit={handleLogin}>
                <input
                type="text"
                placeholder="이메일"
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
                <button className="submit-button" type="submit">
                로그인
                </button>
            </form>
          </div>
        </div>
      </div>

      {/* 테스트용 사용자 정보 출력 */}
      <div className="test-info" style={{ textAlign: "center", marginTop: "30px" }}>
        <p>{jwtStatus}</p>
        <br />
        {userInfo && (
          <div>
            <p>이름: {userInfo.name}</p>
            <p>이메일: {userInfo.email}</p>
            <p>닉네임: {userInfo.nickname}</p>
            <p>제공자: {userInfo.provider}</p>
            <button onClick={logoutHandler} className="submit-button" style={{ marginTop: "10px" }}>
              로그아웃
            </button>
          </div>
        )}
      </div>

      {/* 회원가입 링크 */}
      <div className="signup-link-wrapper">
        <p className="signup-text">
          아직 회원이 아니신가요?{" "}
          <Link to="/FormRegisterPage" className="signup-link">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginButton;
