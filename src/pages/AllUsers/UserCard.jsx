import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaEdit } from 'react-icons/fa';

export default function UserCard({ user, onDelete }) {
  const Api=import.meta.env.VITE_API_URL
  return (
    <div className="user-card">
      <button
        className="delete-btn"
        onClick={() => onDelete(user._id)}
        title="Delete User"
      >
        <FaTrashAlt />
      </button>

      <div className="card-header">
      <img src={`${Api}${user.image}`} alt="" />
        <p><strong>Name:</strong> {user.name}</p>
      </div>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>

      <Link className="edit-btn" to={`/UpdateRole/${user._id}`}>
        <FaEdit /> Edit Role
      </Link>
    </div>
  );
}
