import React, { useEffect, useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/userContext.jsx';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { IoIosNotifications } from "react-icons/io";
import { FaMessage } from "react-icons/fa6";
import { useNotification } from '../../context/notifications.jsx';

export default function Navbar() {
  const { notifications } = useNotification();
  const [UnreadNotifications, setUnreadNotifications] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const { countUsers } = useUser();
  const token = localStorage.getItem("token");
  const user = useSelector((x) => x.user.user);
  const { i18n, t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const API = import.meta.env.VITE_API_URL;

  const isPrivileged = user?.role === "admin" || user?.role === "moderator";

  useEffect(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    setUnreadNotifications(unread);
  }, [notifications]);

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

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(query.trim() ? `/search?query=${query}` : `/`);
  };

  const Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">

        {/* Left: Logo + Lang */}
        <div className="nav-left">
          <Link to="/" className="logo">🌿 Social-Goal</Link>
          <div className="lang-switcher">
            <img className="flag-icon" src={flags[selectedLang]} alt="flag" />
            <select value={selectedLang} onChange={changeLanguage}>
              <option value="en">EN</option>
              <option value="ar">AR</option>
            </select>
          </div>
        </div>

        {/* Center: Search */}
        <div className="nav-center">
          <input
            type="text"
            className="search-box"
            placeholder={t("Search...")}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Right: Icons (toggled on mobile) */}
        <div className={`nav-right ${menuOpen ? "open" : ""}`}>
          {token && isPrivileged && (
            <Link to="/ChatPage" className="icon-link">
              <FaMessage />
              <span className="count">0</span>
            </Link>
          )}

          <Link to="/notifications" className="icon-link">
            <IoIosNotifications />
            {UnreadNotifications > 0 && <span className="count">{UnreadNotifications}</span>}
          </Link>

          {token && isPrivileged && (
            <Link to="/AllUser" className="icon-link">
              <i className="fa fa-user"></i>
              <span className="count">{countUsers}</span>
            </Link>
          )}

          {token && isPrivileged && (
            <Link to="/adminPanel">
              <button className="AdminBtn">Admin Panel</button>
            </Link>
          )}
        </div>

        {/* Always visible: Profile + Auth */}
        <div className="nav-auth">
          {token && (
            <Link to={`/userDet/${user?.id}`} className="profile-pic-link">
              <img
                className="profile-pic"
                src={
                  user?.image
                    ? user.image.startsWith("http")
                      ? user.image
                      : `${API}${user.image}`
                    : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`
                }
                alt="profile"
              />
            </Link>
          )}

          {token ? (
            <button onClick={Logout} className="logout-btn">Logout</button>
          ) : (
            <Link to="/login">
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
