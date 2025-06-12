import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { useUser } from '../../context/userContext.jsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import egypt from "./Flag_of_Egypt.png"
import UNS from "./Flag_of_the_United_States.png"
export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const handleCloseMenu = () => setMenuOpen(false);
  
  const { countCart, countWishList } = useCart();
  const { countUsers } = useUser();
  const token = localStorage.getItem("token");
  const user = useSelector((x) => x.user.user);
  const navigate = useNavigate();
  const { i18n,t } = useTranslation();
const [selectedLang, setSelectedLang] = useState(i18n.language);
            const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setSelectedLang(i18n.language);
  }, [i18n.language]);

  const flags = {
    en: UNS,
    ar: egypt
  };

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    setSelectedLang(lang);
  };

  const isPrivileged = user?.role === "admin" || user?.role === "moderator"; // 💡 هنا


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(query.trim() ? `/search?query=${query}` : `/`);
  };



  function Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="nav-content">

      <div className="navbar__lang-switcher">
        <img className="flag-icon" src={flags[selectedLang]} alt="flag" />
        <select
          className="lang-select"
          value={selectedLang}
          onChange={changeLanguage}
          aria-label={t("change_language")}
        >
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>

        <div className="nav-left">
          <Link onClick={handleCloseMenu} to="/" className="logo">
            <i className="fa fa-leaf Leaf"></i>
            <h1>Rambo</h1>
          </Link>
        </div>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-box"
          />
        </div>

        <div className={`nav-right ${menuOpen ? 'menu-open' : ''}`}>
          {token && (
            <>
              <Link onClick={handleCloseMenu} to="/cart" className="icon-link">
                <i className="fa fa-cart-plus"></i>
                <span className="count">{countCart}</span>
              </Link>

              <Link onClick={handleCloseMenu} to="/WishList" className="icon-link">
                <i className="fa fa-heart"></i>
                <span className="count">{countWishList}</span>
              </Link>
            </>
          )}

          {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/AllUser" className="icon-link">
              <i className="fa fa-user"></i>
              <span className="count">{countUsers}</span>
            </Link>
          )}

          {token && (
            <Link onClick={handleCloseMenu} to="/meOrder" className="icon-link">
              <i className="fas fa-box"></i>
            </Link>
          )}

          {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/adminPanel">
              <button className="AdminBtn">Admin Panel</button>
            </Link>
          )}

          {token && (
            <Link onClick={handleCloseMenu} to={`/userDet/${user?.id}`} className="profile-pic-link">
              <img
                className="profile-pic"
                src={
                  user?.image
                    ? user.image.startsWith("http")
                      ? user.image
                      : `${API}${user.image}`
                    : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`
                }
                alt={user?.name || "User"}
              />
            </Link>
          )}

          {token ? (
            <button onClick={() => { setMenuOpen(false); Logout(); }} className="logout-btn">Logout</button>
          ) : (
            <Link onClick={handleCloseMenu} to="/login">
              <button className="login-btn">Login</button>
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}
