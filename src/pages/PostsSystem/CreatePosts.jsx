import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreatePosts.css";
import { usePost } from "../../context/postContext.jsx";

const AddPost = () => {
  const {FetchUserData,setPosts,setuserposts}=usePost()
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const API = import.meta.env.VITE_API_URL;

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("content", content);
    images.forEach((image) => formData.append("imagePost", image));

    try {
      const { data } = await axios.post(`${API}/addPost`, formData, {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Post created successfully");
  setPosts(prev => [data.post, ...prev]);
  setuserposts(prev => [data.post, ...prev]);
        setContent("");
        
        setImages([]);
      }
    } catch (err) {
      console.error("Error creating post", err);
      toast.error("Failed to create post");
    }
  };

  return (
    <div className="add-post-container">
      <h2 className="add-post-title">Create Post</h2>

      <form onSubmit={handleCreatePost} className="add-post-form">
        <textarea
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          required
          className="add-post-textarea"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) =>
            setImages(Array.from(e.target.files).slice(0, 5))
          }
          className="add-post-file"
        />

        <button type="submit" className="add-post-button">
          Submit
        </button>
      </form>

      {images.length > 0 && (
        <div className="image-preview-container">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt={`preview-${idx}`}
              className="image-preview"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AddPost;
