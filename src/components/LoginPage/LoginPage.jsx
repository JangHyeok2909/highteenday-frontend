import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import FindId from "../FindId/FindId";
import FindPw from "../FindPw/FindPw";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const navigate = useNavigate();
  const { login, isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) navigate("/", { replace: true });
  }, [isLogin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div id="login-page">
      <div className="login-container">
        {/* 로고 섹션 */}
        <div className="logo-section">
          <div className="logo-box">
            <span className="logo-text">로고</span>
          </div>
          <h1 className="site-title">하이틴데이</h1>
        </div>

        {/* 로그인 폼 */}
        <form className="login-form" onSubmit={handleLogin}>
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
          <a href="https://highteenday.duckdns.org/oauth2/authorization/kakao" className="social-btn kakao">
            <span className="social-icon">카카오 로그인</span>
          </a>
          <a href="https://highteenday.duckdns.org/oauth2/authorization/naver" className="social-btn naver">
            <span className="social-icon">네이버 로그인</span>
          </a>
          <a href="https://highteenday.duckdns.org/oauth2/authorization/google" className="social-btn google">
            <span className="social-icon">Sign in with Google</span>
          </a>
        </div>
      </div>

      {/* 아이디 찾기 모달 */}
      <FindId 
        isOpen={showFindId} 
        onClose={() => setShowFindId(false)}
        onSwitchToPw={() => {
          setShowFindId(false);
          setShowFindPw(true);
        }}
      />

      {/* 비밀번호 찾기 모달 */}
      <FindPw 
        isOpen={showFindPw} 
        onClose={() => setShowFindPw(false)}
        onSwitchToId={() => {
          setShowFindPw(false);
          setShowFindId(true);
        }}
      />
    </div>
  );
}

export default LoginPage;