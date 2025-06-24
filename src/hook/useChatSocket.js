// hooks/useChatSocket.js
import { useEffect } from "react";
import socket from "../services/socket.js";
import axios from "axios";
import messageSound from "/sounds/new-notification-09-352705.mp3";

const fetchSenderDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/getuser/${id}`, {
      headers: { token },
    });
    return data.data;
  } catch (err) {
    console.error("❌ Error fetching user:", err);
    return { _id: id, name: "Unknown", image: "" };
  }
};

const useChatSocket = ({ userId, currentChatId, setMessages }) => {
  useEffect(() => {
    if (!userId) return;

    socket.emit("addUser", userId);

    const handleNewMessage = (msg) => {
      if (
        msg.senderId === currentChatId ||
        msg.receiverId === currentChatId ||
        msg.senderId?._id === currentChatId ||
        msg.receiverId?._id === currentChatId
      ) {
        if (typeof msg.senderId === "string") {
          fetchSenderDetails(msg.senderId).then((senderData) => {
            const completeMsg = {
              ...msg,
              senderId: senderData,
            };
            setMessages((prev) => [...prev, completeMsg]);
          });
        } else {
          setMessages((prev) => [...prev, msg]);
        }
        new Audio(messageSound).play(); // ✅ لو حابب تشغل صوت الإشعار
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [userId, currentChatId, setMessages]);
};

export default useChatSocket;
