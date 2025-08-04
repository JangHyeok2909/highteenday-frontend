import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./UserInfo.css";
import "../../../../Default.css"
import Circle_user_Icon from "../../../../Icons/Circle_user_Icon";


function UserInfo() {

  const [login, setLogin] = useState(false); 

  return (
    <div id="user-profile-section">
      {login ? (
        <div className="logged-in-state">
          <div className="User-Info">

            <div className="user-icon inline-block">
              <Circle_user_Icon size={30} color={"#3f9763"} />
            </div>
            <div className="user-name inline-block">
              님
            </div>
            <div className="message-icon inline-block">
              메세지
            </div>
            <div className="user-function">
              <span><Link to="/">내 정보</Link></span>
              <span><Link to="/">로그아웃</Link></span>
            </div>
          </div>
          

        </div>
      ) : (
        <div className="logged-out-state">
          <div className="login-btn">
            <Link to="/loginTest">로긔인</Link>
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
