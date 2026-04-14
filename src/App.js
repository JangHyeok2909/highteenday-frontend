import React from "react";
import { Routes, Route } from "react-router-dom";
import WritePostPage from "./components/Post/Post_Inner/WritePostPage";
import NotFound from "./pages/NotFound";
import BoardOverview from "./components/MainPage/Body/BoardSection/BoardSection";
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
import TimetablePage from './components/TimetableRelated/TimetablePage';
import MealPage from "components/MealCalendarPage/MealPage";

import Privacy from "pages/Privacy";
import Terms from "pages/Terms";
import WelcomePage from "pages/WelcomePage";
import Mypage from "components/MyPage/MyPage";
import MyPostLikeActivity from "./components/MyPage/MyPostLikeActivity";


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
      <Route path="/post/edit/:postId" element={<WritePostPage />} />
      {/* my page */}
      <Route path="/mypage" element={<Mypage />}/>
      <Route path="/mypage/posts" element={<MyPostLikeActivity type="posts" />} />
      <Route path="/mypage/comments" element={<MyCommentsPage/>} />
      <Route path="/mypage/scraps" element={<MyPostLikeActivity type="scraps" />} />
      {/* friend */}
      <Route path="/friend" element={<FriendList />} />
      {/*timetable*/}
      <Route path="/timetable" element={<TimetablePage />} />
      {/*meal calender */}
      <Route path="/meal" element={<MealPage />} />
      {/*mypages */}
      {/* <Route path="/mypage" element ={<MyActivity />}/> */}

      {/* 웰컴 페이지 */}
      <Route path="/welcome" element={<WelcomePage />} />
      {/*약관 페이지*/}
      <Route path="/FormRegisterPage" element={<AgreeTermsPage />} />
      {/* 약관 페이지 (필수로 필요한 페이지임) */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      <Route path="*" element={<NotFound />} />
      <Route path="/#" />
    </Routes>
  );
}

export default App;
