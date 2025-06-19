import React from 'react';
import { useNotification } from '../../context/notifications.jsx';
import './notifications.css'; // هنضيف التنسيقات هنا
import axios from 'axios';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';


export default function Notifications() {

  const {t}=useTranslation()
  const { notifications,setNotifications } = useNotification()||[];
const API=import.meta.env.VITE_API_URL
const updateRead=async(NotificationId)=>{
  const {data}=await axios.put(`${API}/updateRead/${NotificationId}`)
  if(data.success){
  toast.success(data.message)
 setNotifications((prev) =>
        prev.map((n) =>
          n._id === NotificationId ? { ...n, isRead: true } : n
        )
      );}
}



  return (


<div className="notifications-container">
  {notifications.length === 0 ? (
    <p className="no-notifications">لا توجد إشعارات حالياً</p>
  ) : (
    notifications.map((n) => (
      <div
        key={n._id}
        className={`notification-card ${n.isRead ? "read" : ""}`}
      >
        <div className="notification-header">
          <img
            src={`http://localhost:9000${n.senderId.image}`}
            alt={n.senderId.name}
            className="sender-image"
          />
          <button
            className="mark-read-icon"
            onClick={() => updateRead(n._id)}
            title={t("ISRead")}
          >
            📩
          </button>
        </div>

        <div className="notification-content">
          <p>
            <strong>{n.senderId.name}</strong> قام بـ
            {n.type === "like" ? " الإعجاب " : ` ${n.type} `}
            بمنشورك
            {n.isRead && <span className="check-icon">✅</span>}
          </p>

          <span className="post-preview">"{n.postId?.content}"</span>
          <span className="timestamp">
            {new Date(n.createdAt).toLocaleString("ar-EG")}
          </span>
        </div>
      </div>
    ))
  )}
</div>

  );
}
