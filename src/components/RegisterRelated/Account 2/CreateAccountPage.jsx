import React from "react";
import CreateAccount from "./CreateAccount";
import RegisterHeader from "components/Header/RegisterHeader/RegisterHeader.jsx";
import "components/Default.css";

function CreateAccountPage() {
  return (
    <div id="CreateAccountPage">
      <div className="content-container">
        <div className="header">
          <RegisterHeader title={"회원가입"} />
        </div>
        <div className="body">
          <CreateAccount />
        </div>
      </div>
    </div>
  );
}

export default CreateAccountPage;
