import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WritePostPage from "./components/Post/Post_Inner/WritePostPage";
import LoginButton from './components/LoginPage/LoginButton/LoginButton';
import NotFound from "./pages/NotFound";
import Register from "./components/LoginRelated/Register";
import UserPage from "./components/LoginRelated/UserPage";
import BoardOverview from "./components/MainPage/Body/BoardSection/BoardSection";
import BoardPage from "./components/Board/BoardPage";
import PostDetail from "./components/Post/Post_Inner/PostDetail";
import UserInfo from "./components/MainPage/Body/UserSection/UserInfo/UserInfo";
import MainPage from "./components/MainPage/MainPage";
import FriendList from "./components/Friend/FriendList";
import MyPostsPage from "./components/MyPage/MyPostsPage";
import MyCommentsPage from "./components/MyPage/MyCommentsPage";
import MyScrapsPage from "./components/MyPage/MyScrapsPage";
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
import MealPage from "components/MealCalendar/MealPage";



import Privacy from "pages/Privacy";
import Terms from "pages/Terms";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      {/* user related */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/CreateAccount" element={<CreateAccountPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
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
      <Route path="/board/:boardId/post/:postId" element={<PostSection />} />
      <Route path="/post/write" element={<WritePostPage />} />
      {/* <Route path="/board/:boardId/post/:postId" element={<PostDetail />} /> */}
      {/* my page */}
      <Route path="/mypage/posts" element={<MyPostsPage />} />
      <Route path="/mypage/comments" element={<MyCommentsPage />} />
      <Route path="/mypage/scraps" element={<MyScrapsPage />} />
      {/* friend */}
      <Route path="/friend" element={<FriendList />} />
      {/*약관 페이지*/}
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />
      {/* 약관 페이지 (필수로 필요한 페이지임) */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      {/*timetable*/}
      <Route path="/timetable" element={<TimetablePage />} />
      {/*meal calender */}
      <Route path="/meal" element={<MealPage />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/#" />
    </Routes>
  );
}

export default App;
