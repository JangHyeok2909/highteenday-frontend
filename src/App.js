import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WritePostPage from './pages/WritePostPage';
import PostPage from './pages/PostPage';
import LoginButton from './components/LoginButton/LoginButton';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginButton />}/>
        <Route path="/post/write" element={<WritePostPage />} />
        <Route path="/post/view" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;
