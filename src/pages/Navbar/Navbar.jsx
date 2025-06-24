import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext.jsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { FaIcons } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { useNotification } from '../../context/notifications.jsx';
import { FaMessage } from "react-icons/fa6";

export default function Navbar() {
  const {notifications}=useNotification()

  const [UnreadNotifications, setUnreadNotifications] = useState([])
    useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadNotifications(unread);
  }, [notifications]);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const handleCloseMenu = () => setMenuOpen(false);
  

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
    en: "/Flags/Flag_of_the_United_States.png",
  ar: "/Flags/Flag_of_Egypt.png"
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
          <FaIcons/>
            <h1>Social-Goal</h1>
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
         
                   {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/ChatPage" className="icon-link">
              <FaMessage/>
              <span className="count">0</span>
            </Link>
          )}
<Link onClick={handleCloseMenu} to="/notifications" className="icon-link">
              <IoIosNotifications/>
            {UnreadNotifications==0?null: <span className="count">{UnreadNotifications}</span>} 
            </Link>
          {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/AllUser" className="icon-link">
              <i className="fa fa-user"></i>
              <span className="count">{countUsers}</span>
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
