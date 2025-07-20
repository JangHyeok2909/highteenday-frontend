import { useLocation, useNavigate } from "react-router-dom";
import "./UserProfilePage.css";

function UserProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state;

  if (!user) {
    return (
      <div className="profile-container">
        <p className="profile-error">회원 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)} className="back-button">← 뒤로가기</button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>{user.nickname}님의 프로필</h2>
      <div className="profile-card">
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>닉네임:</strong> {user.nickname}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>학교:</strong> {user.school}</p>
        <p><strong>학년:</strong> {user.grade}</p>
      </div>
      <button onClick={() => navigate(-1)} className="back-button">← 뒤로가기</button>
    </div>
  );
}

export default UserProfilePage;
