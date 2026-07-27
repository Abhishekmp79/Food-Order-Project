import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../../redux/actions/userActions";
import { toast } from "react-toastify";
import Search from "./Search";
import "../../App.css";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { cartItems = [] } = useSelector((state) => state.cart);
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    setMenuOpen(false);
  };

  const cartCount = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  return (
    <header className="fo-header">
      <div className="fo-header-inner">
        {/* Brand */}
        <Link to="/" className="fo-brand" onClick={() => setMenuOpen(false)}>
          <span className="fo-brand-icon">🍔</span>
          <span className="fo-brand-name">
            Food<span>Order</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="fo-nav-links">
          <Link to="/" className="fo-nav-link">Home</Link>
          <Link to="/eats/stores/search/" className="fo-nav-link">Restaurants</Link>
        </nav>

        {/* Search */}
        <div className="fo-search">
          <Search />
        </div>

        {/* Actions (desktop) */}
        <div className="fo-actions">
          {/* Cart — its own button */}
          <Link to="/cart" className="fo-cart-btn">
            <span className="fo-cart-icon">🛒</span>
            <span>Cart</span>
            {cartCount > 0 && <span className="fo-cart-badge">{cartCount}</span>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/eats/orders/me/myOrders" className="fo-ghost-btn">
                📦 My Orders
              </Link>
              <Link to="/users/me" className="fo-user-chip">
                <span className="fo-user-avatar">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </span>
                <span className="fo-user-name">
                  {user?.name?.split(" ")[0] || "Account"}
                </span>
              </Link>
              <button className="fo-logout-btn" onClick={logoutHandler}>
                ⎋ Logout
              </button>
            </>
          ) : (
            <>
              {/* Sign In — outline button */}
              <Link to="/users/login" className="fo-signin-btn">
                Sign In
              </Link>
              {/* Sign Up — gradient button */}
              <Link to="/users/signup" className="fo-signup-btn">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="fo-burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="fo-mobile-menu">
          <Link to="/" className="fo-mobile-link" onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>
          <Link to="/cart" className="fo-mobile-link" onClick={() => setMenuOpen(false)}>
            🛒 Cart {cartCount > 0 ? `(${cartCount})` : ""}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/users/me" className="fo-mobile-link" onClick={() => setMenuOpen(false)}>
                👤 Profile
              </Link>
              <Link to="/eats/orders/me/myOrders" className="fo-mobile-link" onClick={() => setMenuOpen(false)}>
                📦 My Orders
              </Link>
              <button className="fo-mobile-link fo-mobile-logout" onClick={logoutHandler}>
                ⎋ Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/users/login" className="fo-mobile-link fo-mobile-outline" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/users/signup" className="fo-mobile-link fo-mobile-primary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
          <Link to="/users/login" className="fo-mobile-link fo-admin" onClick={() => setMenuOpen(false)}>
            ⚙️ Admin Login
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;