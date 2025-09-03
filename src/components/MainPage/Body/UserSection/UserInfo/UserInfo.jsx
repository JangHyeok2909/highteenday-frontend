import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./UserInfo.css";
import "../../../../Default.css";
import Circle_user_Icon from "../../../../Icons/Circle_user_Icon";
import axios from "axios";

function UserInfo() {
  const [login, setLogin] = useState(false); 
  const [user, setUser] = useState(null);

  const loginUser = async () => {
    try {
      const res = await axios.get(`/api/user/userInfo`, {
        withCredentials: true
      });
      setUser(res.data);
      setLogin(true);
    } catch (err) {
      setLogin(false);
    }
  };

  useEffect(() => {
    loginUser();
  }, []);

  const logoutHandler = async () => {
    try {
      await axios.get("/api/user/logout", {
        withCredentials: true,
      });      
    } catch (err) {
      console.log("로그아웃 실패", err);
    } finally {
      console.log("로그아웃 성공");
      setUser(null);
      setLogin(false);
      window.location.reload();
    }
  };
  
  return (
    <div id="user-profile-section">
      {login ? (
        <div className="logged-in-state">
          <div className="User-Info">
            <div className="user-icon inline-block">
              <Circle_user_Icon size={30} color={"#3f9763"} />
            </div>
            <div className="user-name inline-block">
              {user?.nickname}님
            </div>
            <div className="message-icon inline-block">
              메세지
            </div>
            <div className="user-function">
              {/* 내 정보(비밀번호 변경) 페이지로 이동 */}
              <span><Link to="/change-password">내 정보</Link></span>
              <span className="logout-btn" onClick={logoutHandler}>로그아웃</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="logged-out-state">
          <div className="login-btn">
            <Link to="/loginTest">
              <div>로그인</div>
            </Link>
          </div>
          <div className="login-function">
            <span><Link to="/#">아이디 찾기</Link></span>
            <span><Link to="/#">비밀번호 찾기</Link></span>
            <span><Link to="/#">회원가입</Link></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
