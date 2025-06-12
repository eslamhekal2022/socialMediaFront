import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [countCart, setCountCart] = useState(0);
  const [wishList, setWishList] = useState([]);
  const [countWishList, setCountWishList] = useState(0);
  const [users, setUsers] = useState([]);
  const [countUsers, setCountUsers] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  // ================== Cart ==================
  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post(
        `${API}/AddToCart`,
        { productId, quantity },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) {
        toast.success("this product added to cart")
        getCart()
      };
    } catch (err) {
      console.error("Error adding to cart:", err.response?.data?.message || err.message);
      toast.error("فشل في إضافة المنتج للسلة");
    }
  };

  const removeCart = async (productId) => {
    try {
      const { data } = await axios.delete(`${API}/deleteProductCart/${productId}`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (data.success) getCart();
    } catch (err) {
      console.error("Error removing from cart:", err.response?.data?.message || err.message);
      toast.error("فشل في حذف المنتج من السلة");
    }
  };

  const getCart = async () => {
    try {
      const { data } = await axios.get(`${API}/getCart`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (data.success) {
        setCart(data.data || []);
        setCountCart(data.count);
      }
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data?.message || err.message);
    }
  };

  // ================== WishList ==================
  const addToWishList = async (productId) => {
    try {
      const { data } = await axios.post(
        `${API}/addToWishlist`,
        { productId },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      if (data.success) getWishList();
    } catch (err) {
      console.error("Error adding to wishlist:", err.response?.data?.message || err.message);
      toast.error("فشل في إضافة المنتج إلى المفضلة");
    }
  };

  const removeWishList = async (productId) => {
    try {
      const { data } = await axios.delete(`${API}/removeWishList/${productId}`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (data.success) getWishList();
    } catch (error) {
      console.error("Error removing product from wishlist:", error);
    }
  };

  const getWishList = async () => {
    try {
      const { data } = await axios.get(`${API}/WishList`, {
        headers: { token: localStorage.getItem("token") },
      });
      if (data.success) {
        setWishList(data.data || []);
        setCountWishList(data.count);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err.response?.data?.message || err.message);
    }
  };

  // ================== Users ==================
  const getAllUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await axios.get(`${API}/getUsers`);
      if (data.success) {
        setUsers(data.data);
        setCountUsers(data.count);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ================== useEffect ==================
  useEffect(() => {
    getCart();
    getWishList();
    getAllUsers();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        countCart,
        addToCart,
        removeCart,
        getCart,

        wishList,
        countWishList,
        addToWishList,
        removeWishList,
        getWishList,

        users,
        countUsers,
        loadingUsers,
        getAllUsers,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
