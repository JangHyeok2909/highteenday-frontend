import React from "react";
import "../../MainPage.css";
import MainUserInfo from "./UserInfo/MainUserInfo";
import "../../../Default.css";
import "./UserSection.css";
import HotPosts from "./HotPosts/HotPosts";
import TimetableMeal from "./TimeTable/TimetableMeal";


function UserSection() {

  return (
    <>
      <MainUserInfo />
      <TimetableMeal />
      <HotPosts />
    </>
  );
}

export default UserSection;