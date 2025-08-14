import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfilePage.css";

function UserProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const exampleUser = {
    name: "홍길동",
    nickname: "gildong123",
    email: "gildong@example.com",
    provider: "instagram",
  };

  useEffect(() => {
    axios
      .get("/api/user/loginUser", { withCredentials: true }) // 🔑 쿠키 인증용 옵션
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err);
        setUser(exampleUser); // 실패 시 예제 유저 사용
      });
  }, []);

  const currentUser = user ?? exampleUser;

  return (
    <div id="user-profile">
      <div className="profile-container">
        <h2>{currentUser.nickname}님의 프로필</h2>
        <div className="profile-card">
          <p><strong>이름:</strong> {currentUser.name}</p>
          <p><strong>닉네임:</strong> {currentUser.nickname}</p>
          <p><strong>이메일:</strong> {currentUser.email}</p>
          <p><strong>가입 경로:</strong> {currentUser.provider}</p>
        </div>
        <button onClick={() => navigate(-1)} className="back-button">← 뒤로가기</button>
      </div>
    </div>
  );
}

export default UserProfilePage;
