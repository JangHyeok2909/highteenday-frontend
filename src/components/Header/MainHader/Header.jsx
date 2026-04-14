import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../assets/highteenLogo.jpg";
import NotificationBellIcons from "../../Icons/NotificationBellIcon";
import UsersOverlayIcon from "../../Icons/UsersOverlayIcon";
import "./Header.css";
import SidebarMenu from "../SideBar/SidebarMenu";
import "components/Default.css";
import { useAuth } from "../../../contexts/AuthContext";

function Header({ isMainPage }) {
  const { user, isLogin, logout } = useAuth();
  const navigate = useNavigate();

  const linkMoveHandler = () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    navigate("/friend");
  }

  return (
    <div id="header">
      <div className="menu">
        <SidebarMenu size={40} color={"#3f9763"} />
      </div>

      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="하이틴데이" />
      </div>

      <div className="right-section">
        <div className="user-section">
          {!isMainPage && (
            isLogin ? (
              <div className="user-section-logged">
                <span className="user-section-name">{user.nickname}님</span>
                <Link to="/mypage" className="user-section-link">내 정보</Link>
                <button type="button" className="user-section-logout" onClick={() => logout()}>
                  로그아웃
                </button>
              </div>
            ) : (
              <button type="button" className="user-section-login" onClick={() => navigate("/login")}>
                로그인
              </button>
            )
          )}
        </div>
        <div className="function">
          <span onClick={() => linkMoveHandler()} className="padding-minus">
            <UsersOverlayIcon size={32} color={"#3f9763"} />
          </span>
          <Link to="/">
            <NotificationBellIcons size={32} color={"#3f9763"} count={0} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
