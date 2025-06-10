import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./Myorder.css";

export default function MyOrder() {
  const [orderDetails, setOrderDetails] = useState([]);
                const API = import.meta.env.VITE_API_URL;

  async function fetchMyOrder() {
    try {
      const { data } = await axios.get(
        `${API}/getMeOrders`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      if (data.success) {
        setOrderDetails(data.data);
      } else {
        toast.info(data.message || "No orders found");
      }
    } catch (error) {
      toast.error("Failed to fetch your orders");
    }
  }

  useEffect(() => {
    fetchMyOrder();
  }, []);

  return (
    <div className="my-order-container">
      <h2 className="my-order-title">My Orders</h2>
      {orderDetails.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        orderDetails.map((order, orderIndex) => (
          <div key={orderIndex} className={`order-box ${order.status.toLowerCase()}`}>
          <div className="order-summary">
          <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          <p><strong>Customer Name:</strong> {order.userInfo?.name || "N/A"}</p>
          <p><strong>Total Products:</strong> {order.products.length}</p>
          <p><strong>Status:</strong> 
            <span className={`status-${order.status.toLowerCase()}`}>
              {order.status}
            </span>
          </p>
          <p><strong>Total Price:</strong> ${order.totalPrice}</p>
          <p><strong>Phone:</strong> 0{order.userInfo?.phone || "Not available"}</p>

          </div>

            <h4 className="products-title">Products:</h4>
            <div className="products-grid">
              {order.products.map((prod, index) => (
                <div key={index} className="product-card">
                  <img
                    src={
                      prod.images?.[0]
                        ? `${API}${prod.images[0]}`
                        : "/default-product.png"
                    }
                    alt={prod.name}
                    className="product-image"
                  />
                  <p className="product-name">{prod.name}</p>
                  <p><strong>Quantity:</strong> {prod.quantity}</p>
                  <p><strong>Price:</strong> ${prod.price}</p>
                  <p className="product-description">{prod.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
