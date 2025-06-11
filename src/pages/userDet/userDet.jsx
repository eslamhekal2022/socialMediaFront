import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateUserImage } from '../../Redux/user';
import './userDet.css'; 

export default function UserDet() {
  const [userDet, setuserDet] = useState({});
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [timestamp, setTimestamp] = useState(Date.now());
  const dispatch = useDispatch();
                const API = import.meta.env.VITE_API_URL;

  async function getUser() {
    try {
      const { data } = await axios.get(`${API}/getuser/${id}`);
      if (data.success) {
        setuserDet(data.data);
        toast.success('User loaded');
      }
    } catch (err) {
      toast.error('Error getting user');
    }
  }

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

  useEffect(() => {
    getUser();
  }, []);

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

      <h1 className="user-name">{userDet?.name}</h1>
    </div>
  );
}
