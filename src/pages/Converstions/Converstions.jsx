import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Converstion.css';
import useChatSocket from '../../hook/useChatSocket.js';

export default function Converstions() {
  const { id } = useParams(); // دا الـ receiverId
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");


const lastMyMessageIndex = [...messages].reverse().findIndex(msg => {
  const senderId = typeof msg.senderId === 'object' ? msg.senderId._id : msg.senderId;
  return senderId === userId;
});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
        console.log("NewMessage",data.messages)
      }
    } catch (error) {
      console.error("❌ Error fetching messages:", error);
    }
  };

  useEffect(() => {
    getConverstion();
    axios.put(`${API}/markAsRead/${id}`, {}, { headers: { token } })
      .then(() => {
        console.log("✅ الرسائل أصبحت مقروءة");
      })
      .catch((err) => {
        console.error("❌ فشل في تحديث isRead", err);
      });
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
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
        {messages.map((msg,index) => {
          const senderObj = msg.senderId;
          const senderId = typeof senderObj === 'string' ? senderObj : senderObj._id;
          const isSender = senderId === userId;
          const profile = typeof senderObj === 'object' ? senderObj : {};

          return (
            <div key={msg._id} className={`message-box ${isSender ? 'sent' : 'received'}`}>
              <img className='avatar' src={API + profile.image} alt="user" />
              <div className="message-content">
                <div className="name">{profile.name}</div>
                <div className="text">{msg.text}</div>

                {/* ✅ ✅ علامة القراءة للمُرسل فقط */}
 {isSender && index === messages.length - 1 - lastMyMessageIndex && (
  msg.isRead ? (
    <span className="check read">✔✔</span>
  ) : (
    <span className="check">✔</span>
  )
)}

              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage}>إرسال</button>
      </div>
    </div>
  );
}
