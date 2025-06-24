import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Converstion.css'; // ⬅️ الاستايل هنا
import useChatSocket from '../../hook/useChatSocket.js';

export default function Converstions() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useChatSocket({
  userId,
  currentChatId: id,
  setMessages,
});
  const getConverstion = async () => {
    try {
      const { data } = await axios.get(`${API}/getDirectMessages/${id}`, {
        headers: { token },
      });
      if (data.success) {
        setMessages(data.messages);
        console.log("DirectMessages", data);
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getConverstion();
  }, [id]);

  const sendMessage = async () => {
    try {
      if (!text.trim()) return;

      const { data } = await axios.post(
        `${API}/sendMessage`,
        { receiverId: id, text },
        { headers: { token } }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.message]);
        setText("");
      }
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="conversation-container">
      <div className="messages">
      {messages.map((msg) => {
const isSender = msg.senderId === userId || msg.senderId._id === userId;

const profile = msg.senderId || {};
  return (
    <div key={msg._id} className={`message-box ${isSender ? 'sent' : 'received'}`}>
<img className='avatar' src={API + profile.image} alt="user" />
      <div className="message-content">
        <div className="name">{profile.name}</div>
<div className="text">{msg.text}</div>
      </div>
    </div>
  );
})}
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
        />
        <button onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
}
