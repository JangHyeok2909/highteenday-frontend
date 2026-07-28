import React from "react";
import { Helmet } from "react-helmet-async";

function Privacy() {
  return (
    <div className="default-root-value">
      <Helmet>
        <title>개인정보처리방침 | 하이틴데이</title>
      </Helmet>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-4)" }}>
        개인정보처리방침
      </h1>
      <p style={{ color: "var(--color-text-secondary)" }}>
        개인정보처리방침 내용이 준비 중입니다.
      </p>
    </div>
  );
}

export default Privacy;
