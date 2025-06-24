// hooks/useStartConversation.js
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function useStartConversation() {
  const navigate = useNavigate();

  const startConversation = async (receiverId, redirectTo) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/conversations`,
        { receiverId },
        { headers: { token } }
      );
      if (data.success && redirectTo) {
        navigate(redirectTo);
      }
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return { startConversation };
}
