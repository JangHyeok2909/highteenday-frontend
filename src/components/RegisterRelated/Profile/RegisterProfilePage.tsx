import React from "react";
import { Helmet } from "react-helmet-async";
import ProfileUploader from "./ProfileUploader";
import RegisterHeader from "../../Header/RegisterHeader/RegisterHeader";

function RegisterProfilePage() {
  return (
    <div className="register-page default-root-value">
      <Helmet>
        <title>프로필 설정 | 하이틴데이</title>
      </Helmet>
      <RegisterHeader title="프로필 설정" />
      <ProfileUploader mode="register" />
    </div>
  );
}

export default RegisterProfilePage;
