import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../services/socket";
import { toast } from "react-toastify";
import './ChatBox.css'
const ChatBox = ({ currentUserId, receiver }) => {
  const API = import.meta.env.VITE_API_URL;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages/${receiver._id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error("خطأ في جلب الرسائل:", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [receiver]);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      if (data.senderId === receiver._id) {
        setMessages((prev) => [...prev, data]);
        toast.info(`📩 رسالة جديدة من ${data.senderName}`);
        scrollToBottom();
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [receiver]);

  const handleSend = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append("receiverId", receiver._id);
    if (text) formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(`${API}/sendMessage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: localStorage.getItem("token"),
        },
      });
      setMessages((prev) => [...prev, res.data.message]);
      setText("");
      setImage(null);
      scrollToBottom();
    } catch (err) {
      console.error("فشل الإرسال:", err);
    }
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${
              msg.senderId === currentUserId ? "sent" : "received"
            }`}
          >
            {msg.image && (
              <img
                src={`${API}${msg.image}`}
                alt="msg-img"
                className="msg-img"
              />
            )}
            {msg.text && <p>{msg.text}</p>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="اكتب رسالة..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button onClick={handleSend}>إرسال</button>
      </div>
    </div>
  );
};

export default ChatBox;
