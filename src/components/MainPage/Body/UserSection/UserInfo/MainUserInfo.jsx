import { Link } from "react-router-dom";
import "./MainUserInfo.css";
import "../../../../Default.css";
import CircleUserIcon from "../../../../Icons/Circle_user_Icon";
import { useAuth } from "../../../../../contexts/AuthContext";

function MainUserInfo() {
  const { isLogin, user, logout } = useAuth();

  return (
    <div id="user-profile-section">
      {isLogin ? (
        <div className="logged-in-state">
          <div className="user-info-card">
            <div className="user-info-header">
              <div className="user-avatar">
                <CircleUserIcon size={36} color="#3f9763" />
              </div>
              <div className="user-greeting">
                <span className="user-name">{user.nickname}님</span>
                <span className="user-message">안녕하세요</span>
              </div>
            </div>
            <div className="user-info-actions">
              <Link to="/mypage" className="action-link">
                내 정보
              </Link>
              <span className="action-divider">|</span>
              <button type="button" className="action-btn logout-btn" onClick={() => logout()}>
                로그아웃
              </button>
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
