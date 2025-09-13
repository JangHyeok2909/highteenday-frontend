import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MainUserInfo.css";
import "../../../../Default.css";
import Circle_user_Icon from "../../../../Icons/Circle_user_Icon";
import axios from "axios";
import { useAuth } from "../../../../../contexts/AuthContext";

function MainUserInfo() {
  const { isLogin, user, logout } = useAuth();

  return (
    <div id="user-profile-section">
      {isLogin ? (
        <div className="logged-in-state">
          <div className="User-Info">
            <div className="user-icon inline-block">
              <Circle_user_Icon size={30} color={"#3f9763"} />
            </div>
            <div className="user-name inline-block">{user.nickname}님</div>
            <div className="message-icon inline-block">메세지</div>
            <div className="user-function">
              <span>
                <Link to="/mypage">내 정보</Link>
              </span>
              <span className="logout-btn" onClick={() => void logout}>
                로그아웃
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="logged-out-state">
          <div className="login-btn">
            <Link to="/login">
              <div>로그인</div>
            </Link>
          </div>
          <div className="login-function">
            <span>
              <Link to="/#">아이디 찾기</Link>
            </span>
            <span>
              <Link to="/#">비밀번호 찾기</Link>
            </span>
            <span>
              <Link to="/FormRegisterPage">회원가입</Link>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MainUserInfo;
