// src/context/NotificationContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
export const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [countnotifications, setcountNoti] = useState([]);
const API=import.meta.env.VITE_API_URL
  const fetchNotifications = async () => {
    try {
        const token=localStorage.getItem("token")
      const { data } = await axios.get(`${API}/notifications`, {
        headers: {
          token,
        },
      });
      if (data.success) {
        setNotifications(data.notifications);
        setcountNoti(data.countNoti)
        console.log("data.countNoti",data.countNoti)
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider value={{ countnotifications,notifications, setNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotification = () => useContext(NotificationContext);
