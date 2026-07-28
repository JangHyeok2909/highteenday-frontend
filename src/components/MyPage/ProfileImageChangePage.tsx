import React from "react";
import { Helmet } from "react-helmet-async";
import ProfileUploader from "../RegisterRelated/Profile/ProfileUploader";

function ProfileImageChangePage() {
  return (
    <div className="default-root-value">
      <Helmet>
        <title>프로필 사진 변경 | 하이틴데이</title>
      </Helmet>
      <ProfileUploader mode="edit" />
    </div>
  );
}

export default ProfileImageChangePage;
