import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../Header/MainHader/Header";
import LoginButton from "./LoginButton/LoginButton";
import FindId from "../Find/FindId";
import FindPw from "../Find/FindPw";
import "./LoginPage.css";

function LoginPage() {
  const [showFindId, setShowFindId] = useState(false);
  const [showFindPw, setShowFindPw] = useState(false);
  const navigate = useNavigate();
  const { isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) navigate("/", { replace: true });
  }, [isLogin, navigate]);

  return (
    <div id="login-page" className="default-root-value">
      {/* 메인 헤더 적용 */}
      <Header isMainPage={false} />
      
      {/* LoginButton 컴포넌트 사용 */}
      <LoginButton />

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