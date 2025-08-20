import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./ProfileEditPage.css";

function ProfileEditPage() {
  const { user, isLogin } = useAuth();

  // 학년 변환 함수
const getGradeText = (grade) => {
  if (typeof grade === 'string') {
    const gradeMap = {
      'FRESHMAN': '1학년',    
      'SOPHOMORE': '2학년',   
      'JUNIOR': '3학년',      
      'SENIOR': '4학년'       
    };
    return gradeMap[grade] || `${grade}학년`;
  }
  return `${grade}학년`;
};

  // 반 정보 처리 함수
  const getClassText = (userClass) => {
    return userClass ? `${userClass}반` : "0반";
  };

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (phoneNum) => {
    if (!phoneNum) return "";
    
    // 이미 포맷팅되어 있으면 그대로 반환
    if (phoneNum.includes("-")) return phoneNum;
    
    // 11자리 숫자인 경우 포맷팅
    if (phoneNum.length === 11) {
      return phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    
    return phoneNum;
  };

  const handleProfileImageChange = () => {
    console.log("프로필 사진 변경 클릭");
    // 프로필 사진 변경 기능은 나중에 별도 파일에서 구현
  };

  const handleNicknameChange = () => {
    console.log("닉네임 변경 클릭");
    // 닉네임 변경 기능은 나중에 별도 파일에서 구현
  };

  const handleSchoolInfoChange = () => {
    console.log("학교/학년/반 변경 클릭");
    // 학교 정보 변경 기능은 나중에 별도 파일에서 구현
  };

  const handlePasswordChange = () => {
    console.log("비밀번호 변경 클릭");
    // 비밀번호 변경 기능은 나중에 별도 파일에서 구현
  };

  const handlePhoneChange = () => {
    console.log("전화번호 변경 클릭");
    // 전화번호 변경 기능은 나중에 별도 파일에서 구현
  };

  // 로그인하지 않은 경우
  if (!isLogin || !user) {
    return (
      <div id="profile-edit-page">
        <div className="profile-container">
          <div className="profile-header">
            <h1 className="page-title">하이틴데이</h1>
            <div className="header-divider"></div>
          </div>
          <div className="profile-content">
            <div className="no-user-message">
              로그인이 필요합니다.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="profile-edit-page">
      <div className="profile-container">
        {/* 헤더 */}
        <div className="profile-header">
          <h1 className="page-title">하이틴데이</h1>
          <div className="header-divider"></div>
        </div>

        {/* 프로필 수정 컨텐츠 */}
        <div className="profile-content">
          <h2 className="section-title">프로필 수정</h2>

          {/* 프로필 이미지 섹션 */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <div className="profile-image">
                {user.profileUrl ? (
                  <img 
                    src={user.profileUrl} 
                    alt="프로필 이미지" 
                    className="user-avatar"
                  />
                ) : (
                  <div className="default-avatar">
                    <div className="avatar-icon"></div>
                  </div>
                )}
              </div>
              <button className="profile-image-btn" onClick={handleProfileImageChange}>
                프로필 사진 변경 ⓘ
              </button>
            </div>
          </div>

          {/* 프로필 정보 섹션 */}
          <div className="profile-info-section">
            {/* 닉네임 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">닉네임</span>
              </div>
              <div className="info-right">
                <div className="info-content">
                  <span className="info-text">{user.nickname || "닉네임 없음"} 님</span>
                  <button className="change-btn" onClick={handleNicknameChange}>
                    닉네임 변경 &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* 학교/학년 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">학교 / 학년</span>
              </div>
              <div className="info-right">
                <div className="info-content">
                  <div className="school-info">
                    <span className="info-text">
                      {user.schoolName || "학교 없음"} {getGradeText(user.userGrade)} {getClassText(user.userClass)}
                    </span>
                    <div className="school-detail">학교 • 학년 • 반 변경</div>
                  </div>
                  <button className="change-btn" onClick={handleSchoolInfoChange}>
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* 연동된 이메일 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">연동된 이메일</span>
              </div>
              <div className="info-right">
                <span className="info-text">{user.email || "이메일 없음"}</span>
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">비밀번호</span>
              </div>
              <div className="info-right">
                <button className="change-btn" onClick={handlePasswordChange}>
                  비밀번호 변경 &gt;
                </button>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">전화번호</span>
              </div>
              <div className="info-right">
                <div className="info-content">
                  <span className="info-text">
                    {formatPhoneNumber(user.phoneNum) || "전화번호 없음"}
                  </span>
                  <button className="change-btn" onClick={handlePhoneChange}>
                    변경 &gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditPage;