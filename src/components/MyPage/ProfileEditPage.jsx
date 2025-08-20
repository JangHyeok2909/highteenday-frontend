import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronRight } from "lucide-react";
import axios from "axios";
import Header from "../Header/MainHader/Header";
import "./ProfileEditPage.css";

function ProfileEditPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get("/api/user/userInfo", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패:", err);
        setUser(null);
      });
  }, []);

  // 학년 변환 함수 (4학년까지 포함)
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
    if (phoneNum.includes("-")) return phoneNum;
    if (phoneNum.length === 11) {
      return phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return phoneNum;
  };

  // 학교 정보 텍스트 생성 함수
  const getSchoolInfoText = () => {
    if (!user.schoolName) {
      return "학교 없음";
    }
    return `${user.schoolName} ${getGradeText(user.userGrade)} ${getClassText(user.userClass)}`;
  };

  const handleProfileImageChange = () => {
    console.log("프로필 사진 변경 클릭");
  };

  const handleNicknameChange = () => {
    console.log("닉네임 변경 클릭");
  };

  const handleSchoolInfoChange = () => {
    console.log("학교/학년/반 변경 클릭");
  };

  const handlePasswordChange = () => {
    console.log("비밀번호 변경 클릭");
  };

  const handlePhoneChange = () => {
    console.log("전화번호 변경 클릭");
  };

  if (!user) {
    return (
      <div id="profile-edit-page" className="default-root-value">
        {/* 메인 헤더 사용 */}
        <Header isMainPage={false} />
        
        <div className="profile-container">
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
    <div id="profile-edit-page" className="default-root-value">
      {/* 메인 헤더 사용 */}
      <Header isMainPage={false} />
      
      <div className="profile-container">
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
                  <User size={80} color="#6c757d" strokeWidth={1.5} />
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
                <span className="info-text">{user.nickname || "닉네임 없음"} 님</span>
                <button className="change-btn" onClick={handleNicknameChange}>
                  닉네임 변경 <ChevronRight className="change-arrow" />
                </button>
              </div>
            </div>

            {/* 학교/학년 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">학교 / 학년</span>
              </div>
              <div className="info-right">
                <div className="school-info">
                  <span className="info-text">{getSchoolInfoText()}</span>
                </div>
                <button className="change-btn" onClick={handleSchoolInfoChange}>
                  <ChevronRight className="change-arrow" />
                </button>
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
                <span className="info-text"></span>
                <button className="change-btn" onClick={handlePasswordChange}>
                  비밀번호 변경 <ChevronRight className="change-arrow" />
                </button>
              </div>
            </div>

            {/* 전화번호 */}
            <div className="info-row">
              <div className="info-left">
                <span className="info-label">전화번호</span>
              </div>
              <div className="info-right">
                <span className="info-text">
                  {formatPhoneNumber(user.phoneNum) || "전화번호 없음"}
                </span>
                <button className="change-btn" onClick={handlePhoneChange}>
                  변경 <ChevronRight className="change-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditPage;