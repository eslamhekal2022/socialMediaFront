import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './ChatWindow.css'
const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const API = import.meta.env.VITE_API_URL;
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API}/messages/${selectedUser._id}`, {
          headers: { token },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error("فشل تحميل الرسائل", err);
      }
    };

    if (selectedUser) fetchMessages();
  }, [selectedUser]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">{selectedUser?.name}</div>
      <div className="chat-body">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`message ${msg.senderId === currentUserId ? "sent" : "received"}`}
          >
            {msg.text && <p>{msg.text}</p>}
            {msg.image && <img src={`${API}${msg.image}`} alt="msg-img" />}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>
    </div>
  );
};

export default ChatWindow;
