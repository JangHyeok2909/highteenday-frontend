// src/components/RegisterHeader.jsx
import React from "react";
import "./RegisterHeader.css";
import Tile from "react-calendar/dist/Tile";

const RegisterHeader = ({ title }) => {
  return (
    <div id="register-header">
      <header className="header">
        <h1 className="header-title">{title}</h1>
        <div className="header-divider"></div>
      </header>
    </div>
  );
};

export default RegisterHeader;
