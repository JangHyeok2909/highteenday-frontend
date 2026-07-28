import React from "react";
import { Helmet } from "react-helmet-async";

function Terms() {
  return (
    <div className="default-root-value">
      <Helmet>
        <title>이용약관 | 하이틴데이</title>
      </Helmet>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>
        이용약관
      </h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        이용약관 내용이 준비 중입니다.
      </p>
    </div>
  );
}

export default Terms;
