import React from "react";
import "../MainPage.css";
import "./Body.css";
import Banner from "./Banner/Banner";
import SearchSection from "./SearchSection/SearchSection";
import BoardSection from "./BoardSection/BoardSection";
import NoticeSection from "./NoticeSection/NoticeSection";
import UserSection from "./UserSection/UserSection";

function Body() {

  return (
   <div id="body">    
      <div id="body-top">
        <div className="searchSection">
          <SearchSection />
        </div>
        <div className="banner">
          <Banner />
        </div>
      </div>

      <div id="body-bottom">
        <div className="body-left inline-block">
          <div className="NoticeSection">
            <NoticeSection />
          </div>  

          <BoardSection />
        </div>

        <div className="body-right inline-block">
          <UserSection />
        </div>
      </div>
   </div>
  );
}

export default Body;