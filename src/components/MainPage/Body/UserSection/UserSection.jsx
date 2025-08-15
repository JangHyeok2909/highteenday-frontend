import React from "react";
import "../../MainPage.css";
import UserInfo from "./UserInfo/UserInfo";
import "../../../Default.css";
import "./UserSection.css";
import HotPosts from "./HotPosts/HotPosts";
import TimetableMeal from "./TimeTable/TimetableMeal";


function UserSection() {

  return (
   <div id="user-section">    
        <div className="user-info">
            <UserInfo />
        </div>
        <div className="time-table">
          <TimetableMeal />
        </div>
        <div className="hot-posts">
          <HotPosts />
        </div>
   </div>
  );
}

export default UserSection;