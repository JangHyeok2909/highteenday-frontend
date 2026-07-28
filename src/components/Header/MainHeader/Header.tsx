import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Bell } from "lucide-react";
import logo from "../../../assets/highteenLogo.jpg";
import NotificationPanel from "../../Notification/NotificationPanel";
import SidebarMenu from "../SideBar/SidebarMenu";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { Button } from "../../ui";
import "./Header.css";

function Header() {
  const { user, isLogin, logout } = useAuth();
  const { unreadCount, panelOpen, setPanelOpen } = useNotification();
  const navigate = useNavigate();
  const bellRef = useRef<HTMLDivElement>(null);

  const goFriends = () => {
    navigate(isLogin ? "/friend" : "/login");
  };

  const handleBellClick = () => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    setPanelOpen(!panelOpen);
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <div className="app-header__left">
          <SidebarMenu />
          <Link to="/" className="app-header__logo" aria-label="하이틴데이 홈">
            <img src={logo} alt="하이틴데이" />
          </Link>
        </div>

        <div className="app-header__right">
          <button
            type="button"
            className="app-header__icon-button"
            onClick={goFriends}
            aria-label="친구"
          >
            <Users size={22} />
          </button>

          <div className="app-header__bell" ref={bellRef}>
            <button
              type="button"
              className="app-header__icon-button"
              onClick={handleBellClick}
              aria-label="알림"
            >
              <Bell size={22} />
              {isLogin && unreadCount > 0 && (
                <span className="app-header__bell-badge">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
            {panelOpen && <NotificationPanel bellRef={bellRef} />}
          </div>

          <div className="app-header__user">
            {isLogin && user ? (
              <>
                <Link to="/mypage" className="app-header__nickname">
                  {user.nickname}님
                </Link>
                <button
                  type="button"
                  className="app-header__logout"
                  onClick={() => logout()}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Button size="sm" onClick={() => navigate("/login")}>
                로그인
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
