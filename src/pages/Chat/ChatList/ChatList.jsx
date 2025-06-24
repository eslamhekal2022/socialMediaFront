import React, { useEffect, useState } from "react";
import axios from "axios";
import './ChatList.css'
import useStartConversation from "../../../hook/StartConverstion.js";
import { FaMessage } from "react-icons/fa6";

const ChatList = ({ onSelectUser }) => {
  const [users, setUsers] = useState([]);
  const currentUserId = localStorage.getItem("userId");
  const API = import.meta.env.VITE_API_URL;
  const { startConversation } = useStartConversation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${API}/getUsers`, {
        });
        const filtered = res.data.data.filter((u) => u._id !== currentUserId);
        setUsers(filtered);
      } catch (err) {
        console.error("فشل تحميل المستخدمين", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="chat-list">
      <h3>المحادثات</h3>
      {users.map((user) => (
        <div
          key={user._id}
          className="chat-user"
          onClick={() => onSelectUser(user)}
        >
          <img src={`${API}${user.image}`} alt={user.name} className="avatar" />
          <span>{user.name}</span>

         <button onClick={() => startConversation(user._id,`/ChatPage/chat/${user._id}`)}>
<i class="fa-solid fa-comment"></i></button>  
        </div>
      ))}
    </div>
  );
};

export default ChatList;
