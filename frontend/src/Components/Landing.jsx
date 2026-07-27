import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="hero-badge">🍃 Fresh · Fast · Delicious</span>
          <h1 className="hero-title">
            Delicious food, <span>delivered fresh</span> to your door.
          </h1>
          <p className="hero-quote">
            Order from your favourite restaurants and enjoy mouth-watering meals
            delivered hot, fast, and right to your doorstep.
          </p>
          <div className="hero-actions">
            <Link to="/eats/stores/search/" className="hero-cta">
              🍽️ Browse Restaurants
            </Link>
            <Link to="/users/signup" className="hero-cta-outline">
              Create Account
            </Link>
          </div>
          <div className="hero-stats">
            <div><strong>9</strong><span>Restaurants</span></div>
            <div><strong>30 min</strong><span>Delivery</span></div>
            <div><strong>4.8★</strong><span>Rating</span></div>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/flat-lay-green-vegetables-fruits.jpg" alt="Fresh food" />
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">🚀</div>
          <h3>Fast Delivery</h3>
          <p>Hot meals delivered in 30 minutes or less.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">🌿</div>
          <h3>Fresh Ingredients</h3>
          <p>Made fresh with quality ingredients every time.</p>
        </div>
        <div className="feature">
          <div className="feature-icon">💳</div>
          <h3>Easy Payment</h3>
          <p>Secure checkout with multiple options.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;