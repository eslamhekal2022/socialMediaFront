import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [Following, setFollowing] = useState([]);
  const [Followers, setFollowers] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [followingUsers, setFollowingUsers] = useState([]);

  const API = import.meta.env.VITE_API_URL;
  const [userDet, setuserDet] = useState({});

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

    async function getUser(id) {
    try {
      const { data } = await axios.get(`${API}/getuser/${id}`);
      if (data.success) {
        setuserDet(data.data);
      }
    } catch (err) {
      toast.error('Error getting user');
    }
  }



  
const token=localStorage.getItem("token")
 
const handleToggleFollow = async (targetUserId) => {
   
    try {
      const { data } = await axios.put(
        `${API}/follow/${targetUserId}`,
        {},
        {
          headers: {
            token
          }
        }
      );

if(data.success){
     setFollowingUsers((prev) =>
        prev.includes(targetUserId)
          ? prev.filter((id) => id !== targetUserId)
          : [...prev, targetUserId]
      );
}
 
    } catch (err) {
      console.log(err)
      toast.error("حدث خطأ أثناء المتابعة");
    }
  };

  const isFollowing = (userId) => followingUsers.includes(userId);


  useEffect(() => {
    getAllUsers();
  }, [refresh]);

  return (
    <UserContext.Provider value={{ getAllUsers,handleToggleFollow,setFollowingUsers,followingUsers,isFollowing,users, countUsers, loading, setRefresh,getUser,setuserDet,userDet}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
