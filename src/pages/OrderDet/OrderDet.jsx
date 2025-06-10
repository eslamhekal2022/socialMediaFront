import axios from 'axios';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
export default function OrderDet() {

    
    const {id}=useParams()
                const API = import.meta.env.VITE_API_URL;

   async function getOrderDet(){
        const {data}=await axios.get(`${API}/OrderDet/${id}`)
      
    }
    useEffect(()=>{
        getOrderDet()
    },[])
  return (
    <div className='OrderDet'></div>
  )
}
