<<<<<<< HEAD
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WritePostPage from "./components/Post/Post_Inner/WritePostPage";
import LoginButton from './components/LoginPage/LoginButton/LoginButton';
import NotFound from "./pages/NotFound";
import BoardOverview from "./components/MainPage/Body/BoardSection/BoardSection";
import BoardPage from "./components/Board/BoardPage";
import PostDetail from "./components/Post/Post_Inner/PostDetail";
import MainPage from "./components/MainPage/MainPage";
import FriendList from "./components/Friend/FriendList";
import MyPostsPage from "./components/MyPage/activaties/MyPostsPage";
import MyCommentsPage from "./components/MyPage/activaties/MyCommentsPage";
import MyScrapsPage from "./components/MyPage/activaties/MyScrapsPage";
import PostSection from "./components/Post/PostSection";
import AgreeTermsPage from "./components/RegisterRelated/AgreeTerms/AgreeTermsPage";
import CommentSection from "./components/CommentRelated/CommentSection";
import UserProfilePage from "components/MyPage/UserProfilePage.jsx";
import CreateAccountPage from "./components/RegisterRelated/Account/CreateAccountPage";
import SchoolRegisterPage from "./components/RegisterRelated/School/SchoolRegisterPage";
import RegisterProfilePage from "./components/RegisterRelated/Profile/RegisterProfilePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProfileEditPage from "./components/MyPage/ProfileEditPage";
import RegisterHeader from "components/Header/RegisterHeader/RegisterHeader";
import TimetablePage from './components/TimetableRelated/TimetablePage';
import MealPage from "components/MealCalendarPage/MealPage";

import Privacy from "pages/Privacy";
import Terms from "pages/Terms";
import MyActivity from "components/MyPage/activaties/MyActivity";
import Mypage from "components/MyPage/MyPage";
=======
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
import UserProfilePage from './components/MyPage/UserProfilePage.jsx';
import CreateAccountPage from "./components/RegisterRelated/Account/CreateAccountPage";
import SchoolRegisterPage from './components/RegisterRelated/School/SchoolRegisterPage';
import RegisterProfilePage from './components/RegisterRelated/Profile/RegisterProfilePage';
import SchoolChange from './components/RegisterRelated/Profile/SchoolChange';
import ProfileChange from './components/RegisterRelated/Profile/ProfileChange';
import NicknameChange from './components/RegisterRelated/Profile/NicknameChange';
import PassChange from './components/RegisterRelated/Profile/PassChange';
>>>>>>> feature/temporaryJang

function App() {
  return (
    <Routes>
      {/* ✅ 기본 진입(루트)에서 FriendList가 바로 보이도록 변경 */}
      <Route path="/" element={<FriendList />} />

<<<<<<< HEAD

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      {/* user related */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<CreateAccountPage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />
      {/* school */}
      <Route path="/register/school" element={<SchoolRegisterPage />} />
      <Route path="/register/profile" element={<RegisterProfilePage />} />
      {/* board & post */}
      {/* board */}
      <Route path="/board-overview" element={<BoardOverview />} />{" "}
      {/* main page 의 게시판 4개 나중에 삭제 */}
      <Route path="/board/:boardId" element={<BoardPage />} />
      {/* post */}
      <Route path="/board/post/:postId" element={<PostSection />} />
      <Route path="/post/write" element={<WritePostPage />} />
      {/* my page */}
      <Route path="/mypage" element={<Mypage />} />
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/comments" element={<MyCommentsPage />} />
      <Route path="/mypage/scraps" element={<MyScrapsPage />} />
      {/* friend */}
      <Route path="/friend" element={<FriendList />} />
      {/*timetable*/}
      <Route path="/timetable" element={<TimetablePage />} />
      {/*meal calender */}
      <Route path="/meal" element={<MealPage />} />
      {/*mypages */}
      {/* <Route path="/mypage" element ={<MyActivity />}/> */}

      {/*약관 페이지*/}
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />
      {/* 약관 페이지 (필수로 필요한 페이지임) */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
=======
      {/* 기존 메인 페이지 접근용 별도 라우트(필요 시 유지) */}
      <Route path="/main" element={<MainPage />} />

      <Route path="/loginTest" element={<LoginButton />} />
      <Route path="/register" element={<Register />} />
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />
      <Route path="/CreateAccount" element={<CreateAccountPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/register/school" element={<SchoolRegisterPage />} />
      <Route path="/register/profile" element={<RegisterProfilePage />} />

      <Route path="/change-school" element={<SchoolChange />} />
      <Route path="/change-profile" element={<ProfileChange />} />
      <Route path="/change-nickname" element={<NicknameChange />} />
      <Route path="/change-password" element={<PassChange />} />

      <Route path="/board-overview" element={<BoardOverview />} />
      <Route path="/board/:boardId" element={<BoardPage />} />
      <Route path="/board/:boardId/post/:postId" element={<PostSection />} />
      {/* 중복 방지 위해 PostDetail 단일 경로만 유지하거나 필요에 맞게 조정하세요 */}
      <Route path="/post/write" element={<WritePostPage />} />
      <Route path="/post/:postId" element={<PostDetail />} />

      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/comments" element={<MyCommentsPage />} />
      <Route path="/mypage/scraps" element={<MyScrapsPage />} />

      <Route path="/friend" element={<FriendList />} />

>>>>>>> feature/temporaryJang
      <Route path="*" element={<NotFound />} />
      <Route path="/#" />
    </Routes>
  );
}

export default App;
