import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WritePostPage from './pages/WritePostPage.jsx';
import PostPage from './pages/PostPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로 추가 */}
        <Route path="/" element={<PostPage />} />

        {/* 기존 라우트 */}
        <Route path="/post/write" element={<WritePostPage />} />
        <Route path="/post/view" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;