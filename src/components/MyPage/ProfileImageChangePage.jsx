import React from "react";
import { Helmet } from "react-helmet-async";
import ProfileUploader from "components/RegisterRelated/Profile/ProfileUploader";
import Header from "components/Header/MainHader/Header";
import "components/Default.css";

function ProfileImageChangePage() {
  return (
    <div className="default-root-value">
      <Helmet><title>프로필 사진 변경 | 하이틴데이</title></Helmet>
      <Header isMainPage={false} />
      <ProfileUploader mode="edit" />
    </div>
  );
}

export default ProfileImageChangePage;
