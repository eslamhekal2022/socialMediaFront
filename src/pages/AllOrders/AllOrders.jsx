import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './allOrders.css';
import Swal from 'sweetalert2';

export default function AllOrders() {
  const [allOrders, setAllOrders] = useState([]);
            const API = import.meta.env.VITE_API_URL;

  async function getAllOrders() {
    try {
      const { data } = await axios.get(`${API}/getOrders`,{
        headers:{
          token:localStorage.getItem("token")
        }
      });
      if (data.success) {
        setAllOrders(data.data);
        console.log("data-orders",data.data)
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    }
  }


  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.post(
        `${API}/updateOrderStatus/${orderId}`,
        {status:newStatus}
      );

      if (data.success) {
        toast.success("Status updated");
        setAllOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  } catch (error) {
      toast.error("Failed to update status");
    }
  };




    const deleteOrder = async (id) => {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });
    
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${API}/deleteorder/${id}`);
          if (response.data.success) {
            toast.success("User deleted successfully");
            getAllOrders();
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          } else {
            toast.error(response.data.message || "Error deleting user");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Something went wrong");
        }
      }
    };
  

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <div className="AllOrders">
      {allOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        allOrders
        .filter((x)=>x.userId)
        .map((order, i) => (
          <div className="order" key={order._id}>
          <p className='DeleteOrder' onClick={()=>deleteOrder(order._id)}>x</p>
            <h2>Order #{i + 1}</h2>
            <p><strong>Name:</strong> {order.userId?.name}</p>
            <p><strong>Email:</strong> {order.userId?.email}</p>
            <p><strong>phone:</strong> 0{order.userId?.phone}</p>
            <p><strong>Total Price:</strong> ${order.totalPrice}</p>
            <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <div>

              <strong>Status:</strong>{" "}
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
              
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="canceled">Canceled</option>
              </select>
            </div>

            <h4>Products:</h4>
            {order.products.map((prod, index) => (
              <div key={index}>
                <p>Product: {prod.productId?.name || 'N/A'}</p>
                <p>Quantity: {prod.quantity}</p>
              </div>
            ))}

            <hr />
          </div>
        ))
      )}
    </div>
  );
}