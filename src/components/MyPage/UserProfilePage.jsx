import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfilePage.css";
import { useAuth } from "../../contexts/AuthContext"

function UserProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [ profileImage, setProfileImage ] = useState("");

  const { user, isLogin } = useAuth();

  // 예시 유저
  const exampleUser = {
    name: "홍길동",
    nickname: "gildong123",
    school: "경성중학교",
    grade: 3,
    class: 3,
    email: "gildong@example.com",
    password: "********",
    phone: "010-1234-5678",
    provider: "instagram",
    profileImage: null,
  };


  // 값이 없으면 "정보가 없습니다"
  const displayValue = (value) => {
    return value && value !== "" ? value : "정보가 없습니다";
  };

  // 파일 선택 시 실행
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 미리보기
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);

    // 서버 업로드 예시
    const formData = new FormData();
    formData.append("profileImage", file);
    axios
      .post("/api/user/uploadProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      })
      .then(() => {
        console.log("프로필 사진 업로드 성공");
      })
      .catch(() => {
        console.error("프로필 사진 업로드 실패");
      });
  };

  return (
    <div id="user-profile">
      {/* 상단 헤더 */}
      <header className="user-profile-header">
        <h1 className="header-title">하이틴데이</h1>
        <hr className="header-divider" />

        <div className="profile-edit-title">프로필 수정</div>

        {/* 프로필 사진 */}
        <div className="profile-image-container">
          <div className="profile-image-wrapper">
            <img
              src={user.profileImage || "/images/DefaultPhoto.png"}
              alt="프로필 사진"
              className="profile-image"
            />
            <button
              type="button"
              className="change-photo-btn"
              onClick={() => fileInputRef.current.click()}
            >
              사진 변경
            </button>
          </div>
          {/* 숨겨진 파일 입력 */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
      </header>

      {/* 프로필 정보 */}
      <div className="profile-container">
        <h2>{displayValue(user.nickname)}님의 프로필</h2>
        <div className="profile-card">
          <p><strong>이름:</strong> {displayValue(user.name)}</p>
          <p><strong>닉네임:</strong> {displayValue(user.nickname)}</p>
          <p>
            <strong>학교 / 학년 / 반:</strong>{" "}
            {user.schoolName && user.userGrade && user.userClass
              ? `${user.schoolName} ${user.userGrade}학년 ${user.userClass}반`
              : "정보가 없습니다"}
          </p>
          <p><strong>이메일:</strong> {displayValue(user.email)}</p>
          <p><strong>비밀번호:</strong> {"********"}</p>
          <p><strong>전화번호:</strong> {displayValue(user.phoneNum)}</p>
          <p><strong>가입 경로:</strong> {displayValue(user.provider)}</p>
        </div>
        <button onClick={() => navigate(-1)} className="back-button">
          ← 뒤로가기
        </button>
      </div>
    </div>
  );
}

export default UserProfilePage;
