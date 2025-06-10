// components/AddReview.js
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './addReview.css'
const AddReview = () => {
  const [form, setForm] = useState({ comment: '', rating: 5 });
            const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {data}=await axios.post(`${API}/addReviews`,form,{
        headers:{
          token:localStorage.getItem("token")
        }
      });
      if(data.success){
        toast.success("goodReview")
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
   
      <textarea
        placeholder="What's your opinion"
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
        required
      />
      <select
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>⭐{num} </option>
        ))}
      </select>
      <button type="submit">Submit your feedback</button>
    </form>
  );
};

export default AddReview;
