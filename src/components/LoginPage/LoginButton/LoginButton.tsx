import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { filterHangul } from "../../../utils/validationSchemas";
import googleBtn from "../../../assets/google-login-btn.png";
import { Button, Card, Input } from "../../ui";
import "./LoginButton.css";

interface LoginButtonProps {
  setShowFindId: (open: boolean) => void;
  setShowFindPw: (open: boolean) => void;
}

function LoginButton({ setShowFindId, setShowFindPw }: LoginButtonProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login, isLogin } = useAuth();

  useEffect(() => {
    if (isLogin) navigate("/", { replace: true });
  }, [isLogin, navigate]);

  const loginHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="login-card">
      <h1 className="login-card__title">로그인</h1>
      <p className="login-card__subtitle">하이틴데이에 오신 것을 환영해요!</p>

      <form className="login-card__form" onSubmit={loginHandler}>
        <Input
          type="text"
          placeholder="이메일"
          value={email}
          autoComplete="username"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          autoComplete="current-password"
          onChange={(e) => setPassword(filterHangul(e.target.value))}
        />
        <Button type="submit" fullWidth size="lg" isLoading={submitting}>
          로그인
        </Button>
      </form>

      <div className="login-card__links">
        <button
          type="button"
          className="login-card__link"
          onClick={() => setShowFindId(true)}
        >
          아이디 찾기
        </button>
        <span className="login-card__divider" aria-hidden="true">
          |
        </span>
        <button
          type="button"
          className="login-card__link"
          onClick={() => setShowFindPw(true)}
        >
          비밀번호 찾기
        </button>
        <span className="login-card__divider" aria-hidden="true">
          |
        </span>
        <Link to="/FormRegisterPage" className="login-card__link login-card__link--primary">
          회원가입
        </Link>
      </div>

      <div className="login-card__social">
        <div className="login-card__social-label">
          <span>또는</span>
        </div>
        <a href="https://api.highteenday.org/oauth2/authorization/google">
          <img src={googleBtn} alt="구글 로그인" className="login-card__social-img" />
        </a>
      </div>
    </Card>
  );
}

export default LoginButton;
