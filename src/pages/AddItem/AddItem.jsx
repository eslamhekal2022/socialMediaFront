import axios from "axios";
import { useState, useRef } from "react";
import { toast } from "react-toastify";
import "./AddItem.css";
import { useProduct } from "../../context/productContext";

const AddItem = () => {
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    description_en: "",
    description_ar: "",
    price: "",
    category: "tablet",
    images: [],
    imagePreviews: [],
  });
            const API = import.meta.env.VITE_API_URL;

  const { getAllProducts } = useProduct();
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...fileArray],
        imagePreviews: [
          ...prev.imagePreviews,
          ...fileArray.map((file) => URL.createObjectURL(file)),
        ],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const updatedImages = [...prev.images];
      const updatedPreviews = [...prev.imagePreviews];
      updatedImages.splice(index, 1);
      updatedPreviews.splice(index, 1);
      return {
        ...prev,
        images: updatedImages,
        imagePreviews: updatedPreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name_en || !formData.name_ar || !formData.description_en || !formData.description_ar || !formData.price || !formData.category) {
      toast.warning("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    if (formData.images.length === 0) {
      toast.warning("يرجى رفع صورة واحدة على الأقل");
      return;
    }

    const dataAdd = new FormData();
    dataAdd.append("name_en", formData.name_en);
    dataAdd.append("name_ar", formData.name_ar);
    dataAdd.append("description_en", formData.description_en);
    dataAdd.append("description_ar", formData.description_ar);
    dataAdd.append("price", formData.price);
    dataAdd.append("category", formData.category);
    formData.images.forEach((image) => dataAdd.append("images", image));

    try {
      const { data } = await axios.post(
        `${API}/addProduct`,
        dataAdd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success) {
        toast.success("تمت إضافة المنتج بنجاح");
        setFormData({
          name_en: "",
          name_ar: "",
          description_en: "",
          description_ar: "",
          price: "",
          category: "tablet",
          images: [],
          imagePreviews: [],
        });
        getAllProducts();
      } else {
        toast.warning("حدث خطأ أثناء الإضافة.");
      }
    } catch (error) {
      console.error("حدث خطأ أثناء الإضافة:", error);
      toast.error("خطأ في الخادم، يرجى المحاولة لاحقًا.");
    }
  };

  return (
    <div className="add-item-container">
      <h2>إضافة منتج جديد</h2>
      <form className="add-item-form" onSubmit={handleSubmit}>
        <input
          name="name_en"
          placeholder="Name (EN)"
          value={formData.name_en}
          onChange={handleChange}
          required
        />
        <input
          name="name_ar"
          placeholder="الاسم (AR)"
          value={formData.name_ar}
          onChange={handleChange}
          required
        />
        <textarea
          name="description_en"
          placeholder="Description (EN)"
          value={formData.description_en}
          onChange={handleChange}
          required
        />
        <textarea
          name="description_ar"
          placeholder="الوصف (AR)"
          value={formData.description_ar}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="السعر"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="tablet">Tablet</option>
          <option value="TV">TV</option>
          <option value="Laptop">Laptop</option>
        </select>

        <button
          type="button"
          className="upload-btn"
          onClick={() => fileInputRef.current.click()}
        >
          📸 تحميل الصور
        </button>

        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div className="image-preview-container">
          {formData.imagePreviews.map((src, index) => (
            <div key={index} className="image-preview">
              <img src={src} alt={`Preview ${index}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="remove-image-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button type="submit">إضافة المنتج</button>
      </form>
    </div>
  );
};

export default AddItem;
