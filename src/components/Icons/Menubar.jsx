import React from "react";
import { Menu } from "lucide-react";
import "./Icons.css";

function Menubar({ size, color }) {

    
  return (
    <div className="notification-icon-container">
      <Menu color={color} size={size} />
    </div>
  );
}

export default Menubar;