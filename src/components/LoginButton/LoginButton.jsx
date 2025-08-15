import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LoginButton.css";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"; 

function LoginButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate(); 
  // 테스트
  const { login, isLogin } = useAuth();

  useEffect(() => {
    if(isLogin) navigate("/", { replace: true });
  }, [isLogin]);

  const loginhandler = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch {

    }
  };

  // const getJwtStatus = async () => {
  //   try {
  //     const res = await axios.get("/api/user/userInfo", {
  //       withCredentials: true,
  //     });
  //     setJwtStatus("Jwt 작동 중 (로그인 상태)");
  //     setUserInfo(res.data);
  //   } catch (err) {
  //     if (err.response && err.response.status === 401) {
  //       setJwtStatus("Jwt 없음 (비로그인 상태)");
  //       setUserInfo(null);
  //     } else {
  //       setJwtStatus("오류 발생");
  //       setUserInfo(null);
  //     }
  //   }
  // };

  // const logoutHandler = async () => {
  //   try {
  //     await axios.get("/api/user/logout", {
  //       withCredentials: true,
  //     });
  //     console.log("로그아웃 성공");
  //     setUserInfo(null);
  //     setJwtStatus("Jwt 없음 (비로그인 상태)");
  //   } catch (err) {
  //     console.log("로그아웃 실패", err);
  //   }
  // };

  // useEffect(() => {
  //   getJwtStatus();
  // }, []);

  // const handleLogin = async () => {
  // try {
  //   await axios.post("/api/user/login", {
  //     email: id,
  //     password: pw,
  //   }, {
  //     withCredentials: true,
  //   });

  //     alert("로그인 성공");
  //     await getJwtStatus();
  //     navigate("/"); 

  //   } catch (error) {
  //     console.error("로그인 실패", error);

  //     if (error.response && error.response.status === 401) {
  //       alert("아이디 또는 비밀번호가 올바르지 않습니다.");
  //       setJwtStatus("Jwt 없음 (비로그인 상태)");
  //     } else {
  //       alert("서버 오류 또는 네트워크 오류");
  //       setJwtStatus("오류 발생");
  //     }

  //     setUserInfo(null);
  //   }
  // };

  return (
    <div id="login-page">
      {/* 로고 */}
      <header className="logo-header">
        <img src="/images/highteenLogo.jpg" alt="메인 로고" className="logo-img" />
      </header>

      {/* 로그인 */}
      <div className="login-wrapper">
        <h2 className="login-title">회원 로그인</h2>

        <div className="login-content">
          {/* 소셜 로그인 */}
          <div className="social-login">
            <a href="https://highteenday.duckdns.org/oauth2/authorization/naver">
              <img src="/images/navLogin.png" alt="네이버 로그인" className="login-button" />
            </a>
            <a href="https://highteenday.duckdns.org/oauth2/authorization/kakao">
              <img src="/images/kakaLogo.png" alt="카카오 로그인" className="login-button" />
            </a>
            <a href="https://highteenday.duckdns.org/oauth2/authorization/google">
              <img src="/images/googLogin.png" alt="구글 로그인" className="login-button" />
            </a>
          </div>

          {/* 일반 로그인 */}
          <div className="idpw-login">
            <input
              type="text"
              placeholder="아이디"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-box"
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-box"
            />
            <button className="submit-button" onClick={loginhandler}>
              로그인
            </button>
          </div>
        </div>
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

