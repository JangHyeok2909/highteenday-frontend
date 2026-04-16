import React from "react";
import ProfileUploader from "components/RegisterRelated/Profile/ProfileUploader";
import Header from "components/Header/MainHader/Header";
import "components/Default.css";

function ProfileImageChangePage() {
  return (
    <div className="default-root-value">
      <Header isMainPage={false} />
      <ProfileUploader mode="edit" />
    </div>
  );
}

export default ProfileImageChangePage;
