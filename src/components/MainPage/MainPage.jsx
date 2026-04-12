import React from "react";
import Header from "../Header/MainHader/Header";
import Body from "./Body/Body";
import "./MainPage.css";
import "../Default.css";
function MainPage() {

  return (
    <div id="MainPage" className="default-root-value">
      <div className="content-container">
        <div className="header">
          <Header isMainPage={true} />
        </div>

        <div className="body">
          <Body />
        </div>
      </div>
    </div>
  );
}

export default MainPage;
