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
        <Route path="/" element={<LoginButton />} />
        <Route path="/post/write" element={<WritePostPage />} />
        <Route path="/post/view" element={<PostPage />} />
        <Route path="/meals" element={<MealPage />} />
      </Routes>
    </Router>
  );
}

export default App;
