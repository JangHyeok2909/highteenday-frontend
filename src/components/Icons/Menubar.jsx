import React from "react";
import { Menu } from "lucide-react";
import "./Icons.css";

function Menubar({ size, color }) {

    
  return (
    <div className="menu-icon-container">
      <Menu className="lucide-icon" color={color} size={size} />
    </div>
  );
}

export default Menubar;