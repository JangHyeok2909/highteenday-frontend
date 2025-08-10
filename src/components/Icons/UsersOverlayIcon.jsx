import React from "react";
import { User } from "lucide-react";
import "./Icons.css";

 function UsersOverlayIcon({size, color}) {
  return (
    <div className="user-icon-overlay-container lucide-icon">
      <User color={color} size={size} strokeWidth={1.5} fill={color}/>
      <User color={color} size={size-8} strokeWidth={1.5} fill={color} className="user-icon-overlay-small" />
    </div>
  );
}

export default UsersOverlayIcon;