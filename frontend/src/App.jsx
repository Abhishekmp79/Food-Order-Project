import React, { useEffect, useRef } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Landing from "./Components/Landing";
import Home from "./Components/Home";
import Header from "./Components/layout/Header";
import Footer from "./Components/layout/Footer";
import Menu from "./Components/Menu";
import Login from "./Components/user/Login";
import Register from "./Components/user/Register";
import Profile from "./Components/user/Profile";
import UpdateProfile from "./Components/user/UpdateProfile";
import ForgotPassword from "./Components/user/ForgotPassword";
import NewPassword from "./Components/user/NewPassword";
import Cart from "./Components/cart/Cart";
import OrderSuccess from "./Components/cart/OrderSuccess";
import ListOrders from "./Components/order/ListOrders";
import OrderDetails from "./Components/order/OrderDetails";
import AdminLogin from "./Components/admin/AdminLogin";
import AdminDashboard from "./Components/admin/AdminDashboard";
import { loadUser } from "./redux/actions/userActions";
import { createOrder } from "./redux/actions/orderActions";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // 🛡️ DEDUP GUARD — ensures the order is created exactly ONCE per payment
  const handledSessionRef = useRef(null);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sessionId = params.get("session_id");
    if (sessionId && handledSessionRef.current !== sessionId) {
      handledSessionRef.current = sessionId; // mark as handled BEFORE dispatch
      dispatch(createOrder(sessionId));
      navigate("/success", { replace: true });
    }
  }, [location.search, dispatch, navigate]);

  return (
    <div className="App">
      <Header />
      <main className="container container-fluid py-4">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/eats/stores/search/:keyword" element={<Home />} />
          <Route path="/eats/stores/:id/menus" element={<Menu />} />
          <Route path="/users/login" element={<Login />} />
          <Route path="/users/signup" element={<Register />} />
          <Route path="/users/register" element={<Register />} />
          <Route path="/users/me" element={<Profile />} />
          <Route path="/users/me/update" element={<UpdateProfile />} />
          <Route path="/users/password/forgot" element={<ForgotPassword />} />
          <Route path="/users/forgetPassword" element={<ForgotPassword />} />
          <Route path="/users/password/reset/:token" element={<NewPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/eats/orders/me/myOrders" element={<ListOrders />} />
          <Route path="/eats/orders/:id" element={<OrderDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </div>
  );
}

export default App;