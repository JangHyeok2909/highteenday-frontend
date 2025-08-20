import React from 'react';
import { Routes, Route } from 'react-router-dom';

import WritePostPage from './components/Post/Post_Inner/WritePostPage';
import LoginButton from './components/LoginButton/LoginButton';
import NotFound from './pages/NotFound';
import Register from './components/LoginRelated/Register';
import UserPage from './components/LoginRelated/UserPage';
import BoardOverview from "./components/MainPage/Body/BoardSection/BoardSection";
import BoardPage from "./components/Board/BoardPage";
import PostDetail from "./components/Post/Post_Inner/PostDetail";
import UserInfo from "./components/MainPage/Body/UserSection/UserInfo/UserInfo";
import MainPage from './components/MainPage/MainPage';
import FriendList from './components/Friend/FriendList';
import MyPostsPage from './components/MyPage/MyPostsPage';
import MyCommentsPage from './components/MyPage/MyCommentsPage';
import MyScrapsPage from './components/MyPage/MyScrapsPage';
import PostSection from './components/Post/PostSection';
import AgreeTermsPage from './components/RegisterRelated/AgreeTerms/AgreeTermsPage';
import CommentSection from './components/Comment/CommentSection';
// import Timetable from './components/TimetableRelated/Timetable';
import UserProfilePage from './components/MyPage/UserProfilePage.jsx';
import CreateAccountPage from "./components/RegisterRelated/Account/CreateAccountPage"; 
import SchoolRegisterPage from './components/RegisterRelated/School/SchoolRegisterPage';
import RegisterProfilePage from './components/RegisterRelated/Profile/RegisterProfilePage';
import SchoolChange from './components/RegisterRelated/Profile/SchoolChange';

// 🔹 프로필 수정 페이지
import ProfileChange from './components/RegisterRelated/Profile/ProfileChange';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/loginTest" element={<LoginButton />} />
      <Route path="/register" element={<Register />} />
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />
      <Route path="/CreateAccount" element={<CreateAccountPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/register/school" element={<SchoolRegisterPage />} />
      <Route path="/register/profile" element={<RegisterProfilePage />} />

      {/* 학교 정보 변경 */}
      <Route path="/change-school" element={<SchoolChange />} />

      {/* 프로필 수정 */}
      <Route path="/change-profile" element={<ProfileChange />} />

      {/* board & post */}
      <Route path="/board-overview" element={<BoardOverview />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="/board/:boardId/post/:postId" element={<PostSection />} />
      <Route path="/post/write" element={<WritePostPage />} />
      <Route path="/board/:boardId/post/:postId" element={<PostDetail />} />

      {/* my page */}
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/comments" element={<MyCommentsPage />} />
      <Route path="/mypage/scraps" element={<MyScrapsPage />} />

      {/* friend */}
      <Route path="/friend" element={<FriendList />} />

      {/* fallback */}
      <Route path="*" element={<NotFound />} />
      <Route path="/#" />
    </Routes>
  );
}

export default App;
