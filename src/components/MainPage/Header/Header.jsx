import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBellIcons from "../../Icons/NotificationBellIcon";
import UserAddIcon from "../../Icons/UserAddIcon";
import UsersOverlayIcon from "../../Icons/UsersOverlayIcon";
import "./Header.css";
import SidebarMenu from "./SideBar/SidebarMenu";
import "../../Default.css"


function Header() {

  return (
   <div id="header">    
    <div className="menu">
        <SidebarMenu size={40} color={"#3f9763"}/>
    </div>

    <div className="logo">
        logo
    </div>

    <div className="function">
        <span><UserAddIcon size={32} color={"#3f9763"} /></span>
        <span className="padding-minus"><UsersOverlayIcon size={32} color={"#3f9763"}/></span>
        <span><NotificationBellIcons size={32} color={"#3f9763"} count={0}/></span> {/* count 는 나중에 api로 들고와서 넣기 */}
    </div>
   </div>
  );
}

export default Header;

