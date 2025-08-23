import React from "react";
import SchoolSearch from "./SchoolSearch";
import RegisterHeader from "components/Header/RegisterHeader/RegisterHeader.jsx";
import "components/Default.css";

function SchoolRegisterPage() {
  return (
    <div id="SchoolRegisterPage">
      <div className="content-container">
        <div className="header">
          <RegisterHeader title={"학교 설정"} />
        </div>
        <div className="body">
          <SchoolSearch />
        </div>
      </div>
    </div>
  );
}

export default SchoolRegisterPage;
