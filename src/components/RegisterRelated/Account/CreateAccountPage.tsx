import React from "react";
import { Helmet } from "react-helmet-async";
import CreateAccount from "./CreateAccount";
import RegisterHeader from "../../Header/RegisterHeader/RegisterHeader";

function CreateAccountPage() {
  return (
    <div className="register-page default-root-value">
      <Helmet>
        <title>회원가입 | 하이틴데이</title>
      </Helmet>
      <RegisterHeader title="회원가입" />
      <CreateAccount />
    </div>
  );
}

export default CreateAccountPage;
