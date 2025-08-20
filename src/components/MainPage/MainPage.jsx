import React from "react";
import Header from "../Header/MainHader/Header";
import Body from "./Body/Body";
import "./MainPage.css";
import "../Default.css";
import { useAuth } from "../../contexts/AuthContext";

function MainPage() {
  const { user, isLogIn, logout } = useAuth();

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
