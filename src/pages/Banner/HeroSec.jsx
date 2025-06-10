import React from 'react';
import './Banner.css';
import { Link } from 'react-router-dom';
import LapTop from "./OIP_10.jpeg"
import { useTranslation } from 'react-i18next';

const HeroSection = () => {
  const {t}=useTranslation()
  return (
    <header className="hero">
     
<div className='LayoutHero'>
<img src={LapTop} alt="" />
</div>
      <div className="hero-content">
      
        <h2>{t("Home1")}</h2>
        <p> {t("Home2")}</p>
       <Link to={"/allProducts"}>
       <button className="cta-button">    Shop now    </button>
       </Link> 
      </div>
    </header>
  );
};

export default HeroSection;
