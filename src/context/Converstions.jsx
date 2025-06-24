// src/context/NotificationContext.js
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const ConversationContext = createContext();
export const ConversationProvider = ({ children }) => {

const API=import.meta.env.VITE_API_URL
// const startConversation = async (receiverId) => {
//   try {
//     const token = localStorage.getItem("token");
//     const { data } = await axios.post(
//       `${API}/conversations`,
//       { receiverId },
//       { headers: { token } }
//     );

//     if (data.success) {
//       navigate(`/chat/${receiverId}`);
//     }
//   } catch (error) {
//     console.error("Error creating conversation:", error);
//   }
// };
  return (
    <ConversationContext.Provider value={{startConversation}}>
      {children}
    </ConversationContext.Provider>
  );
};


export const useConversation = () => useContext(ConversationContext);
