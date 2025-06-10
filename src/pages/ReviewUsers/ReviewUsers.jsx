import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './ReviewUser.css';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
export default function ReviewUsers() {
  const [reviews, setReviews] = useState([]);
  const [MeReview, setMeReview] = useState(false);
  const {t}=useTranslation()
                const API = import.meta.env.VITE_API_URL;

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    getAllReview();
  }, []);

  async function getAllReview() {
    try {
      const { data } = await axios.get(`${API}/getAllReview`);
      if (data.success) {
        setReviews(data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch reviews");
      console.error(error);
    }
  }

  async function deleteReview(id) {
    try {
      const { data } = await axios.delete(`${API}/deleteReview/${id}`);
      if (data.success) {
        toast.success("Review is deleted");
        getAllReview();
      }
    } catch (error) {
      toast.error("Failed to delete review");
      console.error(error);
    }
  }

  if (!user) return <p className="loading">Loading user data...</p>;

  return (
    <div className="ReviewUsers">
      <h1 className="titleHome">{t("Testimonials")}</h1>
      <div className="review-container">
        {reviews.filter(review => review.userId).length === 0 ? (
          <p className="no-reviews">No reviews available at the moment.</p>
        ) : (
          reviews
            .filter(review => review.userId)
            .map((review) => (
              <div className="review-card" key={review._id}>
              {(user.role === "moderator" ) && (
                <p className='DeleteRev' onClick={() => deleteReview(review._id)}>x</p>
              )}

                <img
                  className='user-image'
                  src={
                    review.userId?.image
                      ? review.userId.image.startsWith("http")
                        ? review.userId.image
                        : `${API}${review.userId.image}`
                      : `https://ui-avatars.com/api/?name=${review.userId?.name || 'User'}&background=random&color=fff`
                  }
                  alt={review?.name || "User"}
                />
                <h3 className="user-name">{review.userId.name}</h3>
                <p className="rating">Rating: {review.rating} ⭐</p>
                <p className="comment">“{review.comment}”</p>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
