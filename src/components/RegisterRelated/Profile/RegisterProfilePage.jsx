import React from "react";
import { Helmet } from "react-helmet-async";
import ProfileUploader from "./ProfileUploader";
import RegisterHeader from "components/Header/RegisterHeader/RegisterHeader.jsx";
import "components/Default.css";

function RegisterProfilePage() {
  return (
    <div id="RegisterProfilePage">
      <Helmet><title>프로필 설정 | 하이틴데이</title></Helmet>
      <div className="content-container">
        <div className="header">
          <RegisterHeader title={"프로필 설정"} />
        </div>
        <div className="body">
          <ProfileUploader mode="register" />
        </div>
      </div>
    </div>
  );
}

export default RegisterProfilePage;
