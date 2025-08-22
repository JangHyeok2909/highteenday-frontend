import Header from "components/Header/MainHader/Header";
import UserInfo from "components/MyPage/UserInfo";
import "components/Default.css";

function Mypage() {
  return (
    <div id="Mypage" className="default-root-value">
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