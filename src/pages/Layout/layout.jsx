import React, { useEffect } from 'react'
import { Outlet} from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import { useDispatch } from 'react-redux';
import { setUserRedux } from '../../Redux/user.js';
import ScrollToTop from '../ScrollTop/ScrollTop.jsx';
import Footer from '../Footer/Footer.jsx';

export default function Layout() {

  
  const dispatch = useDispatch();

useEffect(() => {
  // 1. نقرأ البيانات من localStorage
  const storedUser = localStorage.getItem("user");

  // 2. لو في بيانات، نرجّعها لـ Redux
  if (storedUser) {
    dispatch(setUserRedux(JSON.parse(storedUser)));
  }
}, [dispatch]);

  return (
    <>
    <ScrollToTop/>

    <Navbar/>

<Outlet></Outlet>
<Footer/>

    </>
  )
 }
