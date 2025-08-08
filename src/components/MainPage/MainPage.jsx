import React from "react";
import Header from "./Header/Header";
import Body from "./Body/Body";
import "./MainPage.css";
import "../Default.css"

function MainPage() {

  return (
    <div id="MainPage">
      <div className="content-container">
        <div className="header">
          <Header />
        </div>

        <div className="body">
          <Body />
        </div>
      </div>
    </div>
  );
}

export default MainPage;