import React from "react";
import "./Body.css";
import Banner from "./Banner/Banner";
import BoardSection from "./BoardSection/BoardSection";
import NoticeSection from "./NoticeSection/NoticeSection";
import UserSection from "./UserSection/UserSection";

function Body() {
  return (
    <div className="main-body">
      <div className="main-body__left">
        <Banner />
        <NoticeSection />
        <BoardSection />
      </div>

      <div className="main-body__right">
        <UserSection />
      </div>
    </div>
  );
}

export default Body;
