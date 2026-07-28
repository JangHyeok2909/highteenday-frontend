import React from "react";
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import WritePostPage from "./components/Post/Post_Inner/WritePostPage";
import NotFound from "./pages/NotFound";
import BoardPage from "./components/Board/BoardPage";
import MainPage from "./components/MainPage/MainPage";
import FriendList from "./components/Friend/FriendList";
import MyCommentsPage from "./components/MyPage/activaties/MyCommentsPage";
import PostSection from "./components/Post/PostSection";
import AgreeTermsPage from "./components/RegisterRelated/AgreeTerms/AgreeTermsPage";
import CreateAccountPage from "./components/RegisterRelated/Account/CreateAccountPage";
import SchoolRegisterPage from "./components/RegisterRelated/School/SchoolRegisterPage";
import RegisterProfilePage from "./components/RegisterRelated/Profile/RegisterProfilePage";
import LoginPage from "./components/LoginPage/LoginPage";
import ProfileEditPage from "./components/MyPage/ProfileEditPage";
import ProfileImageChangePage from "./components/MyPage/ProfileImageChangePage";
import SchoolChangePage from "./components/MyPage/SchoolChangePage";
import PasswordChangePage from "./components/MyPage/PasswordChangePage";
import NicknameChangePage from "./components/MyPage/NicknameChangePage";
import PhoneChangePage from "./components/MyPage/PhoneChangePage";
import TimetablePage from "./components/TimetableRelated/TimetablePage";
import MealPage from "components/MealCalendarPage/MealPage";

import Privacy from "pages/Privacy";
import Terms from "pages/Terms";
import WelcomePage from "pages/WelcomePage";
import Mypage from "components/MyPage/MyPage";
import MyPostLikeActivity from "./components/MyPage/MyPostLikeActivity";

function App() {
  return (
    <Routes>
      {/* 공통 헤더 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* profile */}
        <Route path="/profile/edit" element={<ProfileEditPage />} />
        <Route path="/profile/edit/image" element={<ProfileImageChangePage />} />
        <Route path="/profile/edit/school" element={<SchoolChangePage />} />
        <Route path="/profile/edit/password" element={<PasswordChangePage />} />
        <Route path="/profile/edit/nickname" element={<NicknameChangePage />} />
        <Route path="/profile/edit/phone" element={<PhoneChangePage />} />
        {/* board & post */}
        <Route path="/board/:boardId" element={<BoardPage />} />
        <Route path="/board/post/:postId" element={<PostSection />} />
        <Route path="/post/write" element={<WritePostPage />} />
        <Route path="/post/edit/:postId" element={<WritePostPage />} />
        {/* my page */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/posts" element={<MyPostLikeActivity type="posts" />} />
        <Route path="/mypage/comments" element={<MyCommentsPage />} />
        <Route path="/mypage/scraps" element={<MyPostLikeActivity type="scraps" />} />
        {/* friend */}
        <Route path="/friend" element={<FriendList />} />
        {/* timetable & meal */}
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/meal" element={<MealPage />} />
        {/* terms */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* 회원가입 플로우 (RegisterHeader는 각 페이지가 렌더) */}
      <Route path="/register" element={<CreateAccountPage />} />
      <Route path="/register/school" element={<SchoolRegisterPage />} />
      <Route path="/register/profile" element={<RegisterProfilePage />} />
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />

      {/* 독립 페이지 */}
      <Route path="/welcome" element={<WelcomePage />} />
    </Routes>
  );
}

export default App;
