import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
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
import Cart from './Components/cart/Cart';

import OrderSuccess from "./Components/cart/OrderSuccess"
import ListOrders from "./Components/order/ListOrders"
import OrderDetails from "./Components/order/OrderDetails"
import { loadUser } from "./redux/actions/userActions";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Header />

      <main className="container container-fluid py-4">
        <Routes>
          <Route path="/" element={<Home />} />
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
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/eats/orders/me/myOrders" element={<ListOrders />} />
          <Route path="/eats/orders/:id" element={<OrderDetails />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
      <Footer />
    </div>
  );
}

export default App;
