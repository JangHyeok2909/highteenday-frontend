import React, { useEffect, useState } from "react";
import axios from "axios";
import "./LoginButton.css";
import { useAuth } from "../../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom"; 

function LoginButton() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const navigate = useNavigate(); 
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

  return (
    <div className="login-content">

      <div className="login-container">
        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={loginhandler}>
          <input
            type="email"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button 
            type="submit" 
            className="login-button"
          >
            로그인
          </button>

          <label className="remember-me">
            <input type="checkbox" />
            아이디 저장하기
          </label>
        </form>

        {/* 하단 링크 */}
        <div className="auth-links">
          <button 
            type="button" 
            className="auth-link" 
            onClick={() => setShowFindId(true)}
          >
            아이디 찾기
          </button>
          <span className="divider">|</span>
          <button 
            type="button" 
            className="auth-link" 
            onClick={() => setShowFindPw(true)}
          >
            비밀번호 찾기
          </button>
          <span className="divider">|</span>
          <Link to="/FormRegisterPage" className="auth-link">회원가입</Link>
        </div>

        {/* 소셜 로그인 */}
        <div className="social-login">
          <a href="https://highteenday.duckdns.org/oauth2/authorization/kakao">
            <img src="/images/kakao-login-btn.png" alt="카카오 로그인" className="social-login-img" />
          </a>
          <a href="https://highteenday.duckdns.org/oauth2/authorization/naver" className="naver-btn">
            <img src="/images/naver-login-btn.png" alt="네이버 로그인" className="social-login-img" />
          </a>
          <a href="https://highteenday.duckdns.org/oauth2/authorization/google">
            <img src="/images/google-login-btn.png" alt="구글 로그인" className="social-login-img" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginButton;