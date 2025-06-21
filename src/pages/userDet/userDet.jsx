import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserImage } from '../../Redux/user';
import './userDet.css';
import GetUserPosts from '../PostsSystem/GetUserPosts.jsx';
import AddPost from '../PostsSystem/CreatePosts.jsx';
import { useUser } from '../../context/userContext.jsx';

export default function UserDet() {
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [timestamp, setTimestamp] = useState(Date.now());
  const dispatch = useDispatch();
  const API = import.meta.env.VITE_API_URL;

  const { getUser, setuserDet, userDet } = useUser();

  const [name, setName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) getUser(id);
  }, [id]);

  useEffect(() => {
    if (userDet?.name) {
      setName(userDet.name);
    }
  }, [userDet]);

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post(
        `${API}/updateUserImage/${id}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        setuserDet(prev => ({ ...prev, image: data.data.image }));
        dispatch(updateUserImage(data.data.image));
        setTimestamp(Date.now());
        toast.success('Image updated');
      }
    } catch (err) {
      toast.error('Error uploading image');
    }
  }

  async function handleNameUpdate() {
    try {
      const { data } = await axios.put(
        `${API}/editUser`,
        { name },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.user) {
        setuserDet(data.user);
        toast.success("Name updated successfully");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update name");
    }
  }

  return (
    <div className="user-details-container">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        accept="image/*"
      />

      <img
        className="user-profile-image"
        src={
          userDet?.image
            ? userDet.image.startsWith('http')
              ? `${userDet.image}?t=${timestamp}`
              : `${API}${userDet.image}?t=${timestamp}`
            : `https://ui-avatars.com/api/?name=${userDet?.name}&background=random&color=fff`
        }
        alt={userDet?.name || 'user'}
        onClick={() => fileInputRef.current.click()}
      />

      <div className="user-name-section">
        {isEditing ? (
          <>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="edit-name-input"
            />
            <button onClick={handleNameUpdate} className="save-btn">💾</button>
            <button onClick={() => setIsEditing(false)} className="cancel-btn">✖</button>
          </>
        ) : (
          <>
            <h1 className="user-name">{name}</h1>
            <button onClick={() => setIsEditing(true)} className="edit-btn">✏️</button>
          </>
        )}
      </div>

      <div className="profile-section">
        <AddPost userId={id} />
      </div>

      <div className="profile-section">
        <GetUserPosts />
      </div>
    </div>
  );
}
