import React from "react";
import { Link } from "react-router-dom";
import "./RegisterHeader.css";

interface RegisterHeaderProps {
  title: string;
}

const RegisterHeader = ({ title }: RegisterHeaderProps) => {
  return (
    <header className="register-header">
      <Link to="/" className="register-header__brand">
        하이틴데이
      </Link>
      <h1 className="register-header__title">{title}</h1>
    </header>
  );
};

export default RegisterHeader;
