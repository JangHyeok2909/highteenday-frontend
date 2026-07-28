import React from "react";
import MainUserInfo from "./UserInfo/MainUserInfo";
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
