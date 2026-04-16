import React from "react";
import "../MainPage.css";
import "./Body.css";
import Banner from "./Banner/Banner";
import BoardSection from "./BoardSection/BoardSection";
import NoticeSection from "./NoticeSection/NoticeSection";
import UserSection from "./UserSection/UserSection";

function Body() {
  return (
    <div id="body">
      <div id="body-bottom">
        <div className="body-left">
          <Banner />
          <NoticeSection />
          <BoardSection />
        </div>

        <div className="body-right">
          <UserSection />
        </div>
      </div>
    </div>
  );
}

export default Body;
