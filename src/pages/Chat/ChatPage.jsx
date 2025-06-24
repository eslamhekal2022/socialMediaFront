import { useState } from "react";
import ChatList from "./ChatList/ChatList";
import './ChatPage.css'; 
import { Outlet } from "react-router-dom";

const ChatPage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  return (
    <div className="chat-page">
      <div className="chat-sidebar">
        <ChatList onSelectUser={setSelectedUser} />
      </div>
      <div className="chat-main">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatPage;
