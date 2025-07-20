import { useLocation, useNavigate } from "react-router-dom";
import "./UserProfilePage.css";

function UserProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;

  const exampleUser = {
    name: "홍길동",
    nickname: "gildong123",
    email: "gildong@example.com",
    provider: "instagram"
  };

  const currentUser = user ?? exampleUser;

  return (
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
  );
}

export default UserProfilePage;
