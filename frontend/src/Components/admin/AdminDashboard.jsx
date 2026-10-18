import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getRestaurants } from "../../redux/actions/restaurantActions";
import { myOrders } from "../../redux/actions/orderActions";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { restaurants = [] } = useSelector((state) => state.restaurants);
  const { orders = [] } = useSelector((state) => state.order);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login");
    } else if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      dispatch(getRestaurants(""));
      dispatch(myOrders());
    }
  }, [dispatch, isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="sh-card" style={{ textAlign: "center" }}>
        <h2 className="sh-title">Access Denied</h2>
        <p className="sh-subtitle">You need admin access to view this page.</p>
        <Link to="/admin/login" className="sh-btn">Go to Admin Login</Link>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <div className="admin-dash-header">
        <div>
          <h1 className="admin-dash-title">Admin Dashboard</h1>
          <p className="admin-dash-sub">Welcome back, {user?.name} 👋</p>
        </div>
        <Link to="/eats/stores/search/" className="sh-btn">🍽️ Manage Restaurants</Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat"><strong>{restaurants.length}</strong><span>Restaurants</span></div>
        <div className="admin-stat"><strong>{orders.length}</strong><span>Orders</span></div>
        <div className="admin-stat"><strong>{String(user?.role || "").toUpperCase()}</strong><span>Your Role</span></div>
      </div>

      <div className="admin-actions">
        <Link to="/eats/stores/search/" className="admin-action-card">
          <span className="admin-action-icon">🍴</span>
          <h3>Restaurants</h3>
          <p>Add restaurants, generate AI insights, delete.</p>
        </Link>
        <Link to="/eats/orders/me/myOrders" className="admin-action-card">
          <span className="admin-action-icon">📦</span>
          <h3>Orders</h3>
          <p>View orders and their details.</p>
        </Link>
        <Link to="/users/me" className="admin-action-card">
          <span className="admin-action-icon">👤</span>
          <h3>Profile</h3>
          <p>Update your admin profile and avatar.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;