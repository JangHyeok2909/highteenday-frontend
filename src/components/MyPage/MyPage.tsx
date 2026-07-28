import React from "react";
import { Helmet } from "react-helmet-async";
import UserInfo from "./UserInfo";

function Mypage() {
  return (
    <div className="mypage default-root-value">
      <Helmet>
        <title>마이페이지 | 하이틴데이</title>
      </Helmet>
      <UserInfo />
    </div>
  );
}

export default Mypage;
