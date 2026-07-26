import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/actions/orderActions";
import { clearErrors } from "../../redux/slices/orderSlice";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.order);

  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    if (!session_id) {
      return;
    }

    dispatch(createOrder(session_id));
  }, [dispatch, session_id]);

  useEffect(() => {
    if (!order) {
      return;
    }

    toast.success("Order placed successfully", {
      position: "bottom-right",
    });

    const timer = setTimeout(() => {
      navigate("/eats/orders/me/myOrders");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate, order]);

  useEffect(() => {
    if (!error) {
      return;
    }

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
    <div className="row justify-content-center">
      <div className="col-6 mt-5 text-center">
        {loading ? (
          <>
            <Loader />
            <h2 className="mt-4">We are confirming your order...</h2>
            <p>Please wait on this page for a moment.</p>
          </>
        ) : order ? (
          <>
            <svg
              className="checkmark"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
            >
              <circle
                className="checkmark__circle"
                cx="26"
                cy="26"
                r="25"
                fill="none"
              />
              <path
                className="checkmark__check"
                fill="none"
                d="M14.1 27.2l7.1 7.2 16.7-16.8"
              />
            </svg>

            <h2>Your Order has been placed successfully.</h2>
            <p>Redirecting to your orders...</p>
            <Link to="/eats/orders/me/myOrders">Go to Orders</Link>
          </>
        ) : (
          <>
            <h2>We could not confirm your order yet.</h2>
            <p>
              {session_id
                ? "Please try confirming again."
                : "Missing checkout session in the URL."}
            </p>
            <button className="btn btn-primary mt-3" onClick={retryHandler}>
              Confirm Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderSuccess;
