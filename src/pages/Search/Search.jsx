import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './searchUsers.css';
import { useUser } from '../../context/userContext';
import { useTranslation } from 'react-i18next';
import { FaMessage } from "react-icons/fa6";
import useStartConversation from '../../hook/StartConverstion.js';

const SearchUsersComponent = () => {
  const {t}=useTranslation()
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem("userId");
  const query = new URLSearchParams(location.search).get('query');
  const API = import.meta.env.VITE_API_URL;

const { handleToggleFollow, isFollowing, setFollowingUsers } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (query && query.trim()) {
        try {
          const { data } = await axios.get(`${API}/searchUsers?query=${query}`);
          if (data.success) {
            setUsers(data.data);

            // حدث followingUsers في السياق عشان الزر يتحدث فورًا
            const followingIds = data.data
              .filter(u => u.followers.includes(userId))
              .map(u => u._id);
            setFollowingUsers(followingIds);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      } else {
        setUsers([]);
      }
    };

    fetchData();
  }, [query]);


  const { startConversation } = useStartConversation();

  return (
    <div className="user-search-container">
    {users.length > 0 ? (
  users
    .filter(user => user._id !== userId) // ✅ تجاهل المستخدم الحالي
    .map((user) => (
      <div key={user._id} className="user-card">
        <img
          src={user.image ? `${API}${user.image}` : `https://ui-avatars.com/api/?name=${user.name}`}
          alt={user.name}
          className="user-avatar"
        />
        <div className="user-info">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <button
          onClick={() => handleToggleFollow(user._id)}
          className={`follow-btnSearch ${isFollowing(user._id) ? "unfollow" : ""}`}
        >
          {isFollowing(user._id) ?t("unFollow") : t("Follow")}
        </button>
<button onClick={() => startConversation(user._id,"/chat/"+user._id)}>
  <FaMessage />
</button>  

</div>
    ))
) : (
  <p className="no-results">لا يوجد نتائج</p>
)}
    </div>
  );
};

export default SearchUsersComponent;
