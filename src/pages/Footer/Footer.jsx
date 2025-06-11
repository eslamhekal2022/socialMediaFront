import React from 'react';
import './footer.css';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Rambo</h2>
          <p>Your one-stop shop for everything!</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <Link id='link' to={"/"}>Home</Link>
            <Link id='link' to={"/allProducts"}>Shop</Link>
            <Link id='link' to={"/About"}>About</Link>
            <Link id='link' to={"/Contact"}>Contact</Link>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@rambo.com</p>
          <p>Phone: +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Rambo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
