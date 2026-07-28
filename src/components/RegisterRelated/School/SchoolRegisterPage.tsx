import React from "react";
import { Helmet } from "react-helmet-async";
import SchoolSearch from "./SchoolSearch";
import RegisterHeader from "../../Header/RegisterHeader/RegisterHeader";

function SchoolRegisterPage() {
  return (
    <div className="register-page default-root-value">
      <Helmet>
        <title>학교 설정 | 하이틴데이</title>
      </Helmet>
      <RegisterHeader title="학교 설정" />
      <SchoolSearch />
    </div>
  );
}

export default SchoolRegisterPage;
