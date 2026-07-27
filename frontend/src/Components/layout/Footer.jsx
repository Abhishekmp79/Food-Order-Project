import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="fo-footer">
      <div className="fo-footer-inner">
        <div className="fo-footer-col">
          <h3 className="fo-footer-brand">🍔 Food Order</h3>
          <p>Fresh, delicious meals delivered fast to your door. Order now and taste the difference!</p>
        </div>
        <div className="fo-footer-col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/eats/stores/search/">Restaurants</Link>
          <Link to="/users/login">Sign In</Link>
          <Link to="/users/signup">Sign Up</Link>
        </div>
        <div className="fo-footer-col">
          <h4>Contact</h4>
          <p>📞 +91 81528 49765</p>
          <p>✉️ abhishekm.pujarr@gmail.com</p>
          <p>📍 Hubli, Karnataka, India</p>
        </div>
      </div>
      <div className="fo-footer-bottom">
        © {new Date().getFullYear()} Food Order · Built by Abhishek 🍃
      </div>
    </footer>
  );
};

export default Footer;