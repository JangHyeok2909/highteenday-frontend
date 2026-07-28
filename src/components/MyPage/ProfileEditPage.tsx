import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Avatar, Card, EmptyState } from "../ui";
import "./ProfileEditPage.css";

// 학년 변환 함수 (4학년까지 포함)
const getGradeText = (grade: string | number | undefined): string => {
  if (typeof grade === "string") {
    const gradeMap: Record<string, string> = {
      FRESHMAN: "1",
      SOPHOMORE: "2",
      JUNIOR: "3",
      SENIOR: "4",
    };
    return gradeMap[grade] || `${grade}`;
  }
  return `${grade}`;
};

const getClassText = (userClass: number | undefined): string => {
  return userClass ? `${userClass}반` : "0반";
};

const formatPhoneNumber = (phoneNum: string | undefined): string => {
  if (!phoneNum) return "";
  if (phoneNum.includes("-")) return phoneNum;
  if (phoneNum.length === 11) {
    return phoneNum.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  }
  return phoneNum;
};

function ProfileEditPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="profile-edit default-root-value">
        <EmptyState message="로그인이 필요합니다." />
      </div>
    );
  }

  const schoolInfoText = user.schoolName
    ? `${user.schoolName} ${getGradeText(user.userGrade)}학년 ${getClassText(
        user.userClass
      )}`
    : "학교 없음";

  const rows = [
    {
      label: "닉네임",
      value: `${user.nickname || "닉네임 없음"} 님`,
      action: () => navigate("/profile/edit/nickname"),
      actionLabel: "닉네임 변경",
    },
    {
      label: "학교 / 학년",
      value: schoolInfoText,
      action: () => navigate("/profile/edit/school"),
      actionLabel: "변경",
    },
    {
      label: "연동된 이메일",
      value: user.email || "이메일 없음",
      action: null,
      actionLabel: "",
    },
    {
      label: "비밀번호",
      value: "",
      action: () => navigate("/profile/edit/password"),
      actionLabel: "비밀번호 변경",
    },
    {
      label: "전화번호",
      value: formatPhoneNumber(user.phoneNum) || "전화번호 없음",
      action: () => navigate("/profile/edit/phone"),
      actionLabel: "변경",
    },
  ];

  return (
    <div className="profile-edit default-root-value">
      <Helmet>
        <title>프로필 수정 | 하이틴데이</title>
      </Helmet>
      <h1 className="profile-edit__title">프로필 수정</h1>

      <Card className="profile-edit__image-card">
        <Avatar src={user.profileUrl} alt="프로필 이미지" size={96} />
        <button
          type="button"
          className="profile-edit__image-btn"
          onClick={() => navigate("/profile/edit/image")}
        >
          프로필 사진 변경
        </button>
      </Card>

      <Card flush>
        <ul className="profile-edit__rows">
          {rows.map((row) => (
            <li key={row.label} className="profile-edit__row">
              <span className="profile-edit__label">{row.label}</span>
              <span className="profile-edit__value">{row.value}</span>
              {row.action && (
                <button
                  type="button"
                  className="profile-edit__change"
                  onClick={row.action}
                >
                  {row.actionLabel}
                  <ChevronRight size={15} />
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default ProfileEditPage;
