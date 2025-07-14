import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WritePostPage from './pages/WritePostPage';
import PostPage from './pages/PostPage';
import LoginButton from './components/LoginButton/LoginButton';
import NotFound from './pages/NotFound';
import Register from './components/LoginRelated/Register';
import UserPage from './components/LoginRelated/UserPage';
import CommentSection from './components/CommentRelated/CommentSection';


  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginButton />}/>
          <Route path="/post/write" element={<WritePostPage />} />
          <Route path="/post/view" element={<PostPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/comments" element={<CommentSection postId={1} />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }

  export default App;