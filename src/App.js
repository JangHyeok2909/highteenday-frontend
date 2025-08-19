import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import WritePostPage from './components/Post/Post_Inner/WritePostPage';
import LoginButton from './components/LoginButton/LoginButton';
import NotFound from './pages/NotFound';
import Register from './components/LoginRelated/Register';
import UserPage from './components/LoginRelated/UserPage';
import FormRegisterPage from './components/LoginRelated/FormRegisterPage';
import CreateAccount from './components/LoginRelated/CreateAccount'; 
import SchoolVerification from './components/LoginRelated/SchoolVerification';
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

import FormRegisterPage from './components/registerRelated/FormRegisterPage';
import CreateAccount from './components/registerRelated/CreateAccount'; 
import CommentSection from './components/CommentRelated/CommentSection';
//import Timetable from './components/TimetableRelated/Timetable';
import BoardOverview from "./pages/BoardOverview";
import BoardPage from "./pages/BoardPage";
import PostDetail from "./components/PostDetail";
import UserProfilePage from "./pages/UserProfilePage";
import RegisterSchool from './components/registerRelated/RegisterSchool';
import RegisterProfile from './components/registerRelated/RegisterProfile';
import WelcomePage from './components/registerRelated/WelcomePage';

  function App() {
    return (
        <Routes>
          <Route path="/" element={<MainPage />}/>
          {/* <Route path="login" element={< />}/> */}

          {/* user related */}
          <Route path="/loginTest" element={<LoginButton />}/>
          <Route path="/register" element={<Register />} />
          <Route path="/FormRegisterPage" element={<FormRegisterPage />} />

          <Route path="/CreateAccount" element={<CreateAccount />} /> 
          <Route path="/user-profile" element={<UserProfilePage />} />
          
          {/* school */}
          <Route path="/register/school" element={<RegisterSchool />} />
          <Route path="/register/profile" element={<RegisterProfile />} />

          {/*register */}
          <Route path="/welcome" element={<WelcomePage />} />
          {/* board & post */}
          {/* board */}
          <Route path="/board-overview" element={<BoardOverview />} /> {/* main page 의 게시판 4개 나중에 삭제 */}
          <Route path="/board/:boardId/post/:postId" element={<PostSection />} />
          <Route path="/board/:boardId" element={<BoardPage />} />
          {/* post */}
          <Route path="/post/write" element={<WritePostPage />} />
          <Route path="/board/:boardId/post/:postId" element={<PostDetail />} />
          <Route path="/post/:postId" element={<PostDetail />} />

          {/* my page */}
          <Route path="/mypage/posts" element={<MyPostsPage />} />
          <Route path="/mypage/comments" element={<MyCommentsPage />} />
          <Route path="/mypage/scraps" element={<MyScrapsPage />} />
          
          


          {/* friend */}
          <Route path="/friend" element={<FriendList />} />


          <Route path="*" element={<NotFound />} />
          

          <Route path="/#" />
        </Routes>
    );
  }

export default App;
