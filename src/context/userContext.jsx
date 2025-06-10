import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const getAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API}/getUsers`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setUsers(data.data);
        setCountUsers(data.count);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("حدث خطأ أثناء جلب المستخدمين");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ getAllUsers, users, countUsers, loading, setRefresh }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
