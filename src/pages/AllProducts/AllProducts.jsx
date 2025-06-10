import axios from "axios";
import { toast } from "react-toastify";
import "./allProducts.css";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext.jsx";
import { useProduct } from "../../context/productContext.jsx";
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export default function AllProducts() {
          const API = import.meta.env.VITE_API_URL;

    const { i18n,t } = useTranslation();
  const lang = i18n.language || "en";

  const { addToCart,addToWihsList } = useCart();

const {products,categories,activeCategory,setActiveCategory,getAllProducts}=useProduct()


  const deleteProduct = async (id) => {
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

        const response = await axios.delete(`${API}/removeProduct/${id}`);
        if (response.data.success) {
          toast.success("User deleted successfully");
          getAllProducts();
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        } else {
          toast.error(response.data.message || "Error deleting user");
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };










  const filteredProducts = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <div className="all-products-page">
      
    <div className="category-tabs">
        <button className={`category-tab ${activeCategory === "all" ? "active" : ""}`} onClick={() => setActiveCategory("all")}>
          All
        </button>
        {categories.map((cat, index) => (
          <button key={index} className={`category-tab ${activeCategory === cat ? "active" : ""}`} onClick={() => setActiveCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="products-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, i) => (
            <div key={i} className="product-card">
            <Link id="Link" to={"/ProductDet/"+product._id}>   

              {product.images && product.images.length > 0 ? (
                <img src={`${API}${product.images[0]}`} alt={product.name[lang]} className="product-image" />
              )
              :
              (
                <p className="no-image"> No image available.</p>
              )}

              <div className="product-info">
                <h2 className="product-name">{product.name[lang]}</h2>
                <p className="product-price">{product.price} USD</p>
                <p className="product-desc">{product.description[lang]} </p>
                
              </div>
              </Link>

              <button className="delete-button btnProduct" onClick={() => deleteProduct(product._id)}>{t("deleteProduct")}</button>
              <button className="add-to-cart-btn   btnProduct" onClick={() => addToCart(product._id)}>{t("addToCart")}</button>
              <button className="btn-wishlist  btnProduct" onClick={() => addToWihsList(product._id)}>{t("addToWishlist")}</button>
            </div>
          ))
        ) : (
          <p className="no-products">{t("NoProductFound")}</p>
        )}
      </div>
    </div>
  );
}
