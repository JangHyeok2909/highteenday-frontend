import React from "react";
import { Helmet } from "react-helmet-async";
import Body from "./Body/Body";
import "./MainPage.css";

function MainPage() {
  return (
    <div className="main-page default-root-value">
      <Helmet>
        <title>하이틴데이</title>
      </Helmet>
      <Body />
    </div>
  );
}

export default MainPage;
