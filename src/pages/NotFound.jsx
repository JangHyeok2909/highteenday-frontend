import React, { useState } from 'react';

function NotFound() {
    const [postId, setPostId] = useState('');

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 주소는 존재하지 않거나 이동되었어요.</p>
    </div>
  );
}

export default NotFound;
