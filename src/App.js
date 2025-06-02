import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WritePostPage from './pages/WritePostPage';
import PostPage from './pages/PostPage';
import LoginButton from './components/LoginButton/LoginButton';
import MealPage from './pages/MealPage'; // ✅ 급식페이지 import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginButton />} />  {/* ✅ 원래 로그인 루트 */}
        <Route path="/post/write" element={<WritePostPage />} />
        <Route path="/post/view" element={<PostPage />} />
        <Route path="/meals" element={<MealPage />} /> {/* ✅ 급식표는 /meals 경로 */}
      </Routes>
    </Router>
  );
}

export default App;
