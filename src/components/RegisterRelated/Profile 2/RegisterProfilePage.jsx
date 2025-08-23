import React from "react";
import ProfileUploader from "./ProfileUploader";
import RegisterHeader from "components/Header/RegisterHeader/RegisterHeader.jsx";
import "components/Default.css";

function RegisterProfilePage() {
  return (
    <div id="RegisterProfilePage">
      <div className="content-container">
        <div className="header">
          <RegisterHeader title={"프로필 설정"} />
        </div>
        <div className="body">
          <ProfileUploader />
        </div>
      </div>
    </div>
  );
}

export default RegisterProfilePage;
