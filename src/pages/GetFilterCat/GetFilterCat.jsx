import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import './GetFilterCat.css';
import { Link } from 'react-router-dom';
  import { useTranslation } from 'react-i18next';

export default function GetFilterCat({ category }) {
 const { i18n } = useTranslation();
const lang = i18n.language || localStorage.getItem("i18nextLng") || "en";
  const [data, setdata] = useState([]);
    const API = import.meta.env.VITE_API_URL;

  async function getBYCategory() {
    try {
      const { data } = await axios.get(`${API}/getProductsCat/${category}`);
    
      if (data.success) {
        setdata(data.data);
        console.log("dataFilterCat", data.data);
      }

    } catch (error) {
      toast.error("An error occurred while fetching the data.");
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    if (category) {
      getBYCategory();
    }
  }, [category]);

  return (
    <div className='GetProductsCat'>
      <div className="ContainerGetProductsCat">
        {data?.map((x, i) => (
          <Link to={`/ProductDet/${x._id}`} className='LinkProductDet' id='Link' key={i}>
            <div className='productFilterCat'>
              <img
                src={`${API}${x.images[0]}`}
alt={x.name?.[lang] || 'No name'}
                className="product-image"
              />
<p>{x.name?.[lang] || x.name?.en || "Unnamed Product"}</p>
<p>{x.description?.[lang] || x.description?.en || "No Description"}</p>
              <p>{x.price}$</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
