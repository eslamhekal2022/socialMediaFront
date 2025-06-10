import React, { useRef, useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './checkOut.css';

export default function CheckoutPage() {
  const { cart, getCart } = useCart();
  const navigate = useNavigate();
  const invoiceRef = useRef();
            const API = import.meta.env.VITE_API_URL;

  const[redirectedToReview, setRedirectedToReview] = useState(false);

  const items = Array.isArray(cart) ? cart : [];
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
    0
  );

  const handleConfirmOrder = async (id) => {
    try {
      const { data } = await axios.post(
        `${API}/checkOut`,
        {}, 
        { headers: { token: localStorage.getItem("token") } }
      );

      if (data.success) {
        toast.success(
          <div>
            Order placed successfully ✅
            <br />
            <button
              onClick={() => {
                setRedirectedToReview(true);  
                navigate('/AddReview');
                toast.dismiss();
              }}
              className='RateRestaurant'
            >
              ⭐ Rate the Restaurant
            </button>
          </div>,
          { autoClose: false }
        );
        getCart();
        navigate(`/`);
      } else {
        toast.error(data.message || "Checkout failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="checkout-container">
      <div ref={invoiceRef} id="invoice-section">
        <h2>Checkout Page 🧾</h2>

        {items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="checkout-items">
              {items.map((item, index) => (
                <div key={index} className="checkout-item">
                  <p><strong>{item.name}</strong> × {item.quantity} — ${item.price}</p>
                </div>
              ))}
            </div>

            <h3>Total: ${totalPrice.toFixed(2)}</h3>
          </>
        )}
      </div>

      {items.length > 0 && (
        <button className="confirm-order-btn" onClick={() => handleConfirmOrder(items[0]._id)}>
          ✅ Confirm Order
        </button>
      )}
    </div>
  );
}
