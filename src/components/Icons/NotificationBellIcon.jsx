import React from "react";
import { Bell } from "lucide-react";
import "./Icons.css";

function NotificationBellIcon({ size, color, count }) {

    const displayCount = count > 9 ? "9+" : count;
    
  return (
    <div className="notification-icon-container">
      <Bell className="lucide-icon" color={color} size={size} />
      {count > 0 && <span className="notifnication-badge">{displayCount}</span>}
    </div>
  );
}

export default NotificationBellIcon;