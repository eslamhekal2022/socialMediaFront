import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import notificationSound from "/sounds/new-notification-09-352705.mp3";
import messageSound from "/sounds/message-alert.mp3";
import socket from "../services/socket.js";

const useNotificationSocket = () => {
  const userIdRef = useRef(localStorage.getItem("userId"));

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && userIdRef.current) {
      socket.emit("addUser", userIdRef.current);
    }

    const handleNotification = (data) => {
      const currentUserId = userIdRef.current;
      if (data.receiverId !== currentUserId) return;

      if (data.type === "newMessage") {
        // 🎵 صوت مخصص للرسائل
        const msgAudio = new Audio(messageSound);
        msgAudio.play().catch((err) => console.error("🔇 فشل تشغيل صوت الرسالة:", err));

      

      } else {
        const actionMessages = {
          like: "أعجب بمنشورك",
          comment: "علق على منشورك",
          follow: "قام بمتابعتك",
        };

        const action = actionMessages[data.type] || "قام بشيء ما";

        const audio = new Audio(notificationSound);
        audio.play().catch((err) => console.error("🔇 فشل تشغيل صوت الإشعار:", err));

        toast.info(`📢 ${data.senderName} ${action}`, {
          autoClose: 3000,
          position: "top-right",
        });
      }
    };

    const eventTypes = ["getNotification", "doComment", "getFollow"];
    eventTypes.forEach((event) => socket.on(event, handleNotification));

    return () => {
      eventTypes.forEach((event) => socket.off(event, handleNotification));
    };
  }, []);
};

export default useNotificationSocket;
