import React, { useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useUser } from '../../context/userContext.jsx';
import UserCard from './UserCard.jsx'; // كرت المستخدم مفصول
import './allusers.css';

export default function AllUser() {
  const { users, setUsers, loading, getAllUsers } = useUser();
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    getAllUsers();
  }, []);

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${API}/deleteUser/${id}`);
        if (response.data.success) {
          // احذف من الستيت بس
          setUsers(prev => prev.filter(user => user._id !== id));
          toast.success("User deleted successfully");
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        } else {
          toast.error(response.data.message || "Error deleting user");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="all-users">
      <h2>All Users ({users.length})</h2>
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <UserCard key={user._id} user={user} onDelete={deleteUser} />
          ))
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>
    </div>
  );
}
