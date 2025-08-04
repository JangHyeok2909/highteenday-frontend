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
import SchoolVerification from './components/LoginRelated/SchoolVerification';
import CommentSection from './components/CommentRelated/CommentSection';
import BoardOverview from "./components/MainPage/Body/BoardSection/BoardSection";
import BoardPage from "./pages/BoardPage";
import PostDetail from "./pages/PostDetail";
import UserInfo from "./components/MainPage/Body/UserSection/UserInfo/UserInfo";
import MainPage from './components/MainPage/MainPage';


  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          {/* <Route path="login" element={< />}/> */}
          <Route path="/loginTest" element={<LoginButton />}/>
          <Route path="/post/write" element={<WritePostPage />} />
          <Route path="/post/view" element={<PostPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/FormRegisterPage" element={<FormRegisterPage />} />
          <Route path="/CreateAccount" element={<CreateAccount />} /> 
          <Route path="/school" element={<SchoolVerification />} />
          <Route path="/comments" element={<CommentSection postId={1} />} />
          <Route path="/board-overview" element={<BoardOverview />} />
          <Route path="/board/:boardId/post/:postId" element={<PostDetail />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          <Route path="/user-profile" element={<UserInfo />} />
          <Route path="/post/:postId" element={<PostDetail/>}/>
          <Route path="*" element={<NotFound />} />

          <Route path="/#" />
        </Routes>
      </Router>
    );
  }

  export default App;