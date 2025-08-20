// src/components/RegisterHeader.jsx
import React from "react";
import "./RegisterHeader.css"; 

const RegisterHeader = ({ title }) => {
  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-divider"></div>
    </header>
  );
};

export default RegisterHeader;
