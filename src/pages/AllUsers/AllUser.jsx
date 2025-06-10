import Swal from 'sweetalert2';
import React, { useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';
import { useUser } from '../../context/userContext.jsx';
import './allusers.css';

export default function AllUser() {
  const { users, loading, getAllUsers,setRefresh } = useUser();
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
      cancelButtonText: 'Cancel',
    });
  
    if (result.isConfirmed) {
      try {
        const response = await axios.post(`${API}/deleteUser/${id}`);
        if (response.data.success) {
          toast.success("User deleted successfully");
          getAllUser();
          setRefresh((prev)=>!prev)
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        } else {
          toast.error(response.data.message || "Error deleting user");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="all-users">
      <h2>All Users</h2>
      <div className="user-list">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="user-card">
            <button
                  className="delete-btn"
                  onClick={() => deleteUser(user._id)}
                  title="Delete User"
                >
                  <FaTrashAlt />
                </button>
              <div className="card-header">
                <p><strong>Name:</strong> {user.name}</p>
               
              </div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <Link className="edit-btn" to={`/UpdateRole/${user._id}`}>
                <FaEdit /> Edit Role
              </Link>
            </div>
          ))
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>
    </div>
  );
}
