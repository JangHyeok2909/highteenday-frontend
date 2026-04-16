import React from 'react';
import { Helmet } from 'react-helmet-async';

function NotFound() {

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Helmet><title>페이지를 찾을 수 없습니다 | 하이틴데이</title></Helmet>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 주소는 존재하지 않거나 이동되었어요.</p>
    </div>
  );
}

export default NotFound;
