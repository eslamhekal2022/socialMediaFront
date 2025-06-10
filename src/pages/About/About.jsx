import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h2>About Us</h2>
      <p className="about-intro">
        Welcome to <strong>Rambo</strong> – your ultimate destination for top-quality products, unbeatable deals, and a smooth shopping experience.
      </p>

      <div className="about-section">
        <h3>Who We Are</h3>
        <p>
          Rambo is an e-commerce platform created with the mission of bringing you the best shopping experience from the comfort of your home. We offer a wide variety of products and are committed to customer satisfaction.
        </p>
      </div>

      <div className="about-section">
        <h3>Our Vision</h3>
        <p>
          To become the leading online store in the region, known for quality, reliability, and outstanding service.
        </p>
      </div>

      <div className="about-section">
        <h3>Why Choose Us?</h3>
        <ul>
          <li>Fast and reliable delivery</li>
          <li>Affordable prices</li>
          <li>Secure payment methods</li>
          <li>Excellent customer support</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
