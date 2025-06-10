import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './register.css';
import { useUser as useUserContext } from "../../context/userContext.jsx";

const Register = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    image: null,  // إضافة خاصية للصورة
  });
  const [preview, setPreview] = useState(null);

            const API = import.meta.env.VITE_API_URL;

  const { setRefresh } = useUserContext();
  const navigate = useNavigate();

  // Handle Input Change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUser({ ...user, image: file });
    if (file) {
      setPreview(URL.createObjectURL(file)); // توليد رابط للصورة
    }
  }; 


  const handleRemoveImage = () => {
    setUser({ ...user, image: null });
    setPreview(null);
  };
  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("email", user.email);
      formData.append("password", user.password);
      formData.append("phone", user.phone);
      if (user.image) {
        formData.append("image", user.image);  // إضافة الصورة للـ FormData
      }

      const res = await axios.post(`${API}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // تحديد نوع المحتوى
        },
      });

      if (res.data?.success) {
        navigate("/login");
        setRefresh((prev) => !prev);
        localStorage.setItem("phone", user.phone);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={user.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="phone"
          placeholder="Phone"
          value={user.phone}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
        {preview && (
          <div style={{ marginBottom: "10px",position:"relative" }}>
        
          <button
      type="button"
      onClick={handleRemoveImage}
      className="btnRemoveImg"
    >
      ×
    </button>
            <img
              src={preview}
              alt="Preview"
              className="ImgPrevReg"
            />
          </div>
        )}
        <button className="sub-Auth" type="submit">Register</button>
      </form>
      <p className="PAuth">If you have an account please <Link className="GoAuth" to={"/login"}>click here</Link></p>
    </div>
  );
};

export default Register;
