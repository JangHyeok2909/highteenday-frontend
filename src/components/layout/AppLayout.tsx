import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header/MainHeader/Header";
import "./AppLayout.css";

/** 공통 상단 헤더 + 페이지 본문. 대부분의 라우트가 이 레이아웃 아래에 있다. */
export default function AppLayout() {
  return (
    <div className="app-layout">
      <Header />
      <main className="app-layout__main">
        <Outlet />
      </main>
    </div>
  );
}
