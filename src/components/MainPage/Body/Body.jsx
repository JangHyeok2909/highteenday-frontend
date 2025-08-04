import React, { useEffect, useState } from "react";
import "../MainPage.css";
import Banner from "./Banner/Banner";
import SearchSection from "./SearchSection/SearchSection";

function Body() {

  return (
   <div id="body">    
        <div className="searchSection">
          <SearchSection />
        </div>
        <div className="banner">
          <Banner />
        </div>
        <div className="boardSection">

        </div>
        <div className="userSection">
        
        </div>
   </div>
  );
}

export default Body;