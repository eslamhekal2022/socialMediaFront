import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productCount, setProductCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [productCategory, setProductCategory] = useState([]);

  const API = import.meta.env.VITE_API_URL;

  // جلب كل المنتجات
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/getAllProducts`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      if (data.success) {
        setProducts(data.data);
        const uniqueCategories = [...new Set(data.data.map((p) => p.category))];
        setCategories(uniqueCategories);
        setProductCount(data.count);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب المنتجات");
      console.error("Error fetching products:", error);
    }
  };

  // جلب المنتجات المصنفة حسب الكاتيجوري
  const getProductCategory = async () => {
    try {
      const { data } = await axios.get(`${API}/getCategoryProduct`);
      if (data.success) {
        setProductCategory(data.data);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء جلب التصنيفات");
      console.error("Error fetching category products:", error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getProductCategory();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        getAllProducts,
        products,
        productCount,
        categories,
        activeCategory,
        setActiveCategory,
        productCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
