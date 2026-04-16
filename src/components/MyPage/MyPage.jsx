import { Helmet } from "react-helmet-async";
import Header from "components/Header/MainHader/Header";
import UserInfo from "components/MyPage/UserInfo";
import "components/Default.css";

function Mypage() {
  return (
    <div id="Mypage" className="default-root-value">
      <Helmet><title>마이페이지 | 하이틴데이</title></Helmet>
      <div className="content-container">
        <div className="header">
          <Header isMainPage={false} />
        </div>
        <div className="body">
          <UserInfo />
        </div>
      </div>
    </div>
  );
}

export default Mypage;