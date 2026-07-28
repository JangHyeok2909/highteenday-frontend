import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
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
    <div className="login-page default-root-value">
      <Helmet>
        <title>로그인 | 하이틴데이</title>
      </Helmet>

      <LoginButton setShowFindId={setShowFindId} setShowFindPw={setShowFindPw} />

      <FindId
        isOpen={showFindId}
        onClose={() => setShowFindId(false)}
        onSwitchToPw={() => {
          setShowFindId(false);
          setShowFindPw(true);
        }}
      />

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
