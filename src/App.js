import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WritePostPage from './pages/WritePostPage';
import PostPage from './pages/PostPage';
import LoginButton from './components/LoginButton/LoginButton';
import NotFound from './pages/NotFound';
import Register from './components/LoginRelated/Register';
import UserPage from './components/LoginRelated/UserPage';
import FormRegisterPage from './components/LoginRelated/FormRegisterPage';
import CreateAccount from './components/LoginRelated/CreateAccount'; 





  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<LoginButton />}/>
          <Route path="/post/write" element={<WritePostPage />} />
          <Route path="/post/view" element={<PostPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/FormRegisterPage" element={<FormRegisterPage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} /> 

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    );
  }

  export default App;
