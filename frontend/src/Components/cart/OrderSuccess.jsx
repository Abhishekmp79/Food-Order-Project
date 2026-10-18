import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/actions/orderActions";
import { clearErrors } from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.order);
  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");

  // NOTE: the order is created ONCE in App.jsx (with a dedup guard).
  // This page only displays the result and offers a manual retry.

  useEffect(() => {
    if (!order) return;
    toast.success("Order placed successfully", { position: "bottom-right" });
    const timer = setTimeout(() => navigate("/eats/orders/me/myOrders"), 1800);
    return () => clearTimeout(timer);
  }, [navigate, order]);

  useEffect(() => {
    if (!error) return;
    toast.error(error, { position: "bottom-right" });
    dispatch(clearErrors());
  }, [dispatch, error]);

  const retryHandler = () => {
    if (!session_id) {
      toast.error("Missing checkout session");
      return;
    }
    dispatch(createOrder(session_id));
  };

  return (
    <div className="sh-card" style={{ textAlign: "center" }}>
      {loading ? (
        <>
          <h2 className="sh-title">We are confirming your order…</h2>
          <p className="sh-subtitle">Please wait a moment.</p>
        </>
      ) : order ? (
        <>
          <h2 className="sh-title">Your order has been placed! 🎉</h2>
          <p className="sh-subtitle">Redirecting to your orders…</p>
          <Link to="/eats/orders/me/myOrders" className="sh-btn">Go to Orders</Link>
        </>
      ) : (
        <>
          <h2 className="sh-title">We could not confirm your order yet.</h2>
          <p className="sh-subtitle">
            {session_id ? "Please try confirming again." : "Missing checkout session."}
          </p>
          <button className="sh-btn" onClick={retryHandler}>Confirm Order</button>
        </>
      )}
    </div>
  );
};

export default OrderSuccess;