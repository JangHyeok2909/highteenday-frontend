import React from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationBellIcons from "../../Icons/NotificationBellIcon";
import UserAddIcon from "../../Icons/UserAddIcon";
import UsersOverlayIcon from "../../Icons/UsersOverlayIcon";
import "./Header.css";
import SidebarMenu from "../SideBar/SidebarMenu";
import "components/Default.css";
import { useAuth } from "../../../contexts/AuthContext";

function Header({ isMainPage }) {
  const { user, isLogin, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div id="header">
      <div className="menu">
        <SidebarMenu size={40} color={"#3f9763"} />
      </div>

      <div className="logo" onClick={() => navigate("/")}>
        logo
      </div>

      {isMainPage ? null : isLogin ? (
        <div className="user-section">
          <div className="user-name">{user.nickname} 님</div>
          <div className="function">
            <button
              className="my-info"
              type="button"
              onClick={() => navigate("/#")}
            >
              내 정보
            </button>
            <button className="logout-btn" type="button" onClick={() => logout}>
              로그아웃
            </button>
          </div>
        </div>
      ) : (
        <div className="function">
          <button type="button" onClick={() => navigate("/loginTest")}>
            로그인하쇼
          </button>
        </div>
      )}

      <div className="function">
        <Link to="/friend" className="padding-minus">
          <UsersOverlayIcon size={32} color={"#3f9763"} />
        </Link>
        <Link to="/">
          <NotificationBellIcons size={32} color={"#3f9763"} count={0} />
        </Link>
        {/* 위에 Notification은 다른 페이지가  아니라 팝업 이니까 Link 없엘 예정 */}
      </div>
    </div>
  );
}

export default Header;
