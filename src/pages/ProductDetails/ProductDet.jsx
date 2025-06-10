import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDet.css';
import { useCart } from '../../context/CartContext.jsx';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

export default function ProductDet() {
    const { i18n,t } = useTranslation();
          const API = import.meta.env.VITE_API_URL;


    const lang = i18n.language || "en";
  const [productDetails, setProductDet] = useState({ images: [], reviews: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const { id } = useParams();
  const { addToCart } = useCart();


const user=useSelector((x)=>x.user.user)

  const IdUser=localStorage.getItem("userId")
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`${API}/productDetails/${id}`);
      if (data.success) {
        setProductDet(data.data);
        setMainImage(`${API}${data.data.images[0]}`);
      } else {
        setError("لم يتم العثور على المنتج");
      }
    } catch (error) {
      setError(" خطأ في تحميل بيانات المنتج ");
    } finally {
      setLoading(false);
    }
  };



 

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API}/addProductReview/${id}`, {
        rating,
        comment,
      }, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        toast.success("تم إضافة التقييم بنجاح ✅");
        setProductDet(prev => ({
          ...prev,
          reviews: data.product.reviews,
          averageRating: data.product.averageRating,
        }));
        setRating(0);
        setComment("");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "حدث خطأ أثناء إضافة التقييم ❌");
    }
  };

  const handleEditReview = (reviewId) => {
    const review = productDetails.reviews.find(r => r._id === reviewId);
    if (review) {
      setEditingReviewId(reviewId);
      setEditRating(review.rating);
      setEditComment(review.comment);
    }
  };

  const submitEditReview = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`${API}/editProductReview/${id}/${editingReviewId}`, {
        rating: editRating,
        comment: editComment,
      }, {
        headers: {
          token: localStorage.getItem("token"),
        }
      });

      if (data.success) {
        toast.success("تم تعديل التقييم بنجاح ✅");
        setProductDet(prev => ({
          ...prev,
          reviews: data.product.reviews,
          averageRating: data.product.averageRating,
        }));
        setEditingReviewId(null);
        setEditRating(0);
        setEditComment("");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء تعديل التقييم ❌");
    }
  };

  const handleDeleteReview = async (reviewId) => {
      try {
        const { data } = await axios.delete(`${API}/deleteProductReview/${id}/${reviewId}`, {
          headers: {
            token: localStorage.getItem("token"),
          }
        });

        if (data.success) {
          toast.success("تم حذف التقييم بنجاح ✅");
          fetchProduct()
          setProductDet(prev => ({
            ...prev,
            reviews: data.product.reviews,
            averageRating: data.product.averageRating,
          }));
        }
      } catch (err) {
        console.error(err);
        toast.error("فشل حذف التقييم ❌");
      
    }
  };




  
  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="product-container">
      <div className="product-left">
        <div className="product-images-wrapper">
          <div className="product-thumbnails">
            {productDetails.images.map((img, index) => (
              <img
                key={index}
                src={`${API}${img}`}
                alt={`product-${index}`}
                className="thumbnail"
                onClick={() => setMainImage(`${API}${img}`)}
              />
            ))}
          </div>
          <div className="product-main-image">
            <img src={mainImage} alt={productDetails.name} className="main-image" />
          </div>
        </div>
      </div>

      <div className="product-right">
        <p className="product-category">{t("category")}: {productDetails.category}</p>
        <h1 className="product-title">{t("name")} :{productDetails.name[lang].toUpperCase()}</h1>
        <p className="product-description">{t("desc")} : {productDetails.description[lang]}</p>
        <p className="product-price">{t("price")} : <span>${productDetails.price}</span></p>
        <button className="add-to-cart" onClick={() => addToCart(productDetails._id)}>{t("addToCart")} </button>

        {/* التقييمات */}
        <div className="reviews">
          <h3 className="reviews-title">{t("Review")}:</h3>
          {productDetails.reviews.length === 0 ? (
            <p> {t("NoReview")} </p>
          ) : (
            productDetails.reviews.filter((x)=>x.userId).map((review) => (
              <div key={review._id} className="review">
                {editingReviewId === review._id ? (
                  <form onSubmit={submitEditReview}>
  <select
    value={editRating}
    onChange={(e) => setEditRating(Number(e.target.value))}
    required
  >
    <option value=""> Choose Rating</option>
    {[1, 2, 3, 4, 5].map(num => (
      <option key={num} value={num}>⭐ {num}</option>
    ))}
  </select>
  <textarea
    value={editComment}
    onChange={(e) => setEditComment(e.target.value)}
    placeholder={t("ChooseRating")}
    className="comment-box"
  />
  <button type="submit" className="submit-review">{t("Save-Edit")}</button>
  <button type="button" onClick={() => setEditingReviewId(null)}>{t("Cancel")}</button>
</form>

                ) : (
                  <>
                    <p><strong>{review.name}</strong></p>
                    <p>⭐ {review.rating} / 5</p>
                    <p>{review.comment}</p>
                    {review.userId===IdUser||user.role==="admin"||user.role==="moderator"?
                      <>
                      <button onClick={() => handleEditReview(review._id)}> {t("Edit")}</button>
                      <button onClick={() => handleDeleteReview(review._id)}> {t("Delete")}</button>
                      </>
                      :null}
                             </>
                )}
              </div>
            ))
          )}
        </div>

        {/* إضافة تقييم */}
        <div className="add-review">
          <h3>{t("addReview")}:</h3>
          <form onSubmit={handleReviewSubmit}>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              required
            >
              <option value="">   {t("ChooseRating")}</option>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>⭐{num}</option>
              ))}
            </select>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("writeReview")}
              className="comment-box"
            />
            <button type="submit" className="submit-review">{t("SendEdit")}

</button>
          </form>
        </div>
      </div>
    </div>
  );
}
