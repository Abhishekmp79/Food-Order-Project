import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCartItems,
  removeItemFromCart,
  updateCartQuantity,
} from "../../redux/actions/cartActions";
import { payment } from "../../redux/actions/orderActions";
import { clearErrors as clearCartErrors } from "../../redux/slices/cartSlice";
import { clearErrors as clearOrderErrors } from "../../redux/slices/orderSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupee } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);

  const {
    cartItems = [],
    restaurant = {},
    loading,
    error: cartError,
  } = useSelector((state) => state.cart);
  const { loading: orderLoading, error: orderError } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  useEffect(() => {
    if (cartError) {
      toast.error(cartError);
      dispatch(clearCartErrors());
    }
  }, [cartError, dispatch]);

  useEffect(() => {
    if (orderError) {
      toast.error(orderError);
      dispatch(clearOrderErrors());
    }
  }, [orderError, dispatch]);

  const removeCartItemHandler = (foodItemId) => {
    dispatch(removeItemFromCart(foodItemId));
    toast.success("Item removed from cart");
  };

  const increaseQty = (foodItemId, quantity, stock = 0) => {
    const newQty = quantity + 1;

    if (newQty > stock) {
      toast.error("Exceeded stock limit");
      return;
    }

    dispatch(updateCartQuantity(foodItemId, newQty));
  };

  const decreaseQty = (foodItemId, quantity) => {
    if (quantity > 1) {
      dispatch(updateCartQuantity(foodItemId, quantity - 1));
      return;
    }

    removeCartItemHandler(foodItemId);
  };

  const checkoutHandler = () => {
    if (!user) {
      navigate("/users/login");
      return;
    }

    if (cartItems.length === 0) {
      toast.info("Your cart is empty");
      return;
    }

    dispatch(payment(cartItems, restaurant));
  };

  const totalUnits = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity || 0),
    0
  );

  const totalAmount = cartItems
    .reduce(
      (acc, item) =>
        acc + Number(item.quantity || 0) * Number(item.foodItem?.price || 0),
      0
    )
    .toFixed(2);

  if (loading) {
    return <h2 className="mt-5">Loading your cart...</h2>;
  }

  if (cartItems.length === 0) {
    return <h2 className="mt-5">Your Cart is empty</h2>;
  }

  return (
    <>
      <h2 className="mt-5">
        Your Cart: <b>{cartItems.length} items</b>
      </h2>
      <h3 className="mt-5">
        Restaurant: <b>{restaurant?.name || "Not available"}</b>
      </h3>

      <div className="row d-flex justify-content-between cartt">
        <div className="col-12 col-lg-8">
          {cartItems.map((item) => {
            const foodItem = item.foodItem || {};
            const foodItemId = foodItem._id || item._id;

            return (
              <div className="cart-item" key={foodItemId}>
                <div className="row">
                  <div className="col-4 col-lg-3">
                    <img
                      src={foodItem.images?.[0]?.url || "/images/placeholder.png"}
                      alt={foodItem.name || "Cart item"}
                      height="90"
                      width="115"
                    />
                  </div>

                  <div className="col-5 col-lg-3">{foodItem.name}</div>

                  <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                    <p id="card_item_price">
                      <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                      {foodItem.price ?? 0}
                    </p>
                  </div>

                  <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                    <div className="stockCounter d-inline">
                      <span
                        className="btn btn-danger minus"
                        onClick={() => decreaseQty(foodItemId, item.quantity)}
                      >
                        -
                      </span>

                      <input
                        type="number"
                        className="form-control count d-inline"
                        value={item.quantity}
                        readOnly
                      />

                      <span
                        className="btn btn-primary plus"
                        onClick={() =>
                          increaseQty(
                            foodItemId,
                            item.quantity,
                            foodItem.stock
                          )
                        }
                      >
                        +
                      </span>
                    </div>
                  </div>

                  <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                    <i
                      id="delete_cart_item"
                      className="fa fa-trash btn btn-danger"
                      onClick={() => removeCartItemHandler(foodItemId)}
                    ></i>
                  </div>
                </div>
                <hr />
              </div>
            );
          })}
        </div>

        <div className="col-12 col-lg-3 my-4">
          <div id="order_summary">
            <h4>Order Summary</h4>
            <hr />

            <p>
              Subtotal:
              <span className="order-summary-values">{totalUnits} (Units)</span>
            </p>

            <p>
              Total:
              <span className="order-summary-values">
                <FontAwesomeIcon icon={faIndianRupee} size="xs" />
                {totalAmount}
              </span>
            </p>

            <hr />

            <button
              id="checkout_btn"
              className="btn btn-primary btn-block"
              disabled={loading || orderLoading}
              onClick={checkoutHandler}
            >
              {orderLoading ? "Processing..." : "Check Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
