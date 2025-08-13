import React from "react";
import { Link } from "react-router-dom"
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
        <Link to="/"><UserAddIcon size={32} color={"#3f9763"} /></Link>
        <Link to="/friend" className="padding-minus"><UsersOverlayIcon size={32} color={"#3f9763"}/></Link>
        <Link to="/"><NotificationBellIcons size={32} color={"#3f9763"} count={0}/></Link>
        {/* 위에 Notification은 다른 페이지가  아니라 팝업 이니까 Link 없엘 예정 */}
    </div>
   </div>
  );
}

export default Header;