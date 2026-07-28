import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../../contexts/AuthContext";
import { Avatar, Button, Card } from "../../../../ui";
import "./MainUserInfo.css";

function MainUserInfo() {
  const { isLogin, user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Card className="main-user">
      {isLogin && user ? (
        <>
          <div className="main-user__profile">
            <Avatar src={user.profileUrl} alt="프로필" size={48} />
            <div className="main-user__greeting">
              <span className="main-user__name">{user.nickname}님</span>
              <span className="main-user__school">{user.schoolName}</span>
            </div>
          </div>
          <div className="main-user__actions">
            <Link to="/mypage" className="main-user__link">
              내 정보
            </Link>
            <button
              type="button"
              className="main-user__logout"
              onClick={() => logout()}
            >
              로그아웃
            </button>
          </div>
        </>
      ) : (
        <>
          <Button fullWidth onClick={() => navigate("/login")}>
            로그인
          </Button>
          <div className="main-user__login-links">
            <Link to="/login">아이디 찾기</Link>
            <Link to="/login">비밀번호 찾기</Link>
            <Link to="/FormRegisterPage" className="main-user__signup">
              회원가입
            </Link>
          </div>
        </>
      )}
    </Card>
  );
}

export default MainUserInfo;
