import React from "react";
import { UserRound, Plus } from "lucide-react";
import "./Icons.css";

function UserAddIcon({size, color}) {
    
  return (
    <div className="UserAdd-icon-container lucide-icon">
      <UserRound color={color} size={size} fill={color} />
      <span className="user-add-badge">
        <Plus  color={"white"} strokeWidth={6} size={size/2+5} />
        <Plus  color={color} size={size/2+5} className="overlay-plus"/>
        </span>    
      
    </div>
  );
}

export default UserAddIcon;