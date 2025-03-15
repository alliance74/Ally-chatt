


import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useChatStore } from "../store/useChatStore";

const Notifications = () => {
  const { Notifications, resetNotifications, setNotifications } = useChatStore();
  const [localNotifications, setLocalNotifications] = useState(Notifications);

  useEffect(() => {
    // Sync Zustand state with localStorage
    const syncNotifications = () => {
      const storedNotifications = parseInt(localStorage.getItem("notifications") || "0", 10);
      setLocalNotifications(storedNotifications);
      setNotifications(storedNotifications); // Update Zustand state properly
    };

    window.addEventListener("storage", syncNotifications);
    
    // Cleanup listener on unmount
    return () => window.removeEventListener("storage", syncNotifications);
  }, [setNotifications]);

  // Sync local state when Zustand state changes
  useEffect(() => {
    setLocalNotifications(Notifications);
  }, [Notifications]);

  return (
    <div 
      className="relative" 
      onClick={() => {
        resetNotifications();
        setLocalNotifications(0);
      }}
    >
      <Bell className="text-2xl text-gray-700 cursor-pointer" />
      {localNotifications > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {localNotifications}
        </span>
      )}
    </div>
  );
};

export default Notifications;
