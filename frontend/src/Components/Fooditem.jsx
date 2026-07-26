import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIndianRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addItemToCart,
  updateCartQuantity,
  removeItemFromCart,
} from "../redux/actions/cartActions";
import { getMenus } from "../redux/actions/menuActions";
import api from "../utils/api";

const Fooditem = ({ fooditem, restaurant }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { cartItems } = useSelector((state) => state.cart);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const cartItem = cartItems.find((item) => {
    const cartFoodItemId =
      typeof item.foodItem === "string" ? item.foodItem : item.foodItem?._id;

    return cartFoodItemId === fooditem._id;
  });

  const quantity = cartItem?.quantity ?? 1;
  const showButtons = !isAdmin && !!cartItem;

  const decreaseQty = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      dispatch(updateCartQuantity(fooditem._id, newQuantity));
      return;
    }

    dispatch(removeItemFromCart(fooditem._id));
  };

  const increaseQty = () => {
    if (quantity >= fooditem.stock) {
      alert("Exceeded stock limit");
      return;
    }

    const newQuantity = quantity + 1;
    dispatch(updateCartQuantity(fooditem._id, newQuantity));
  };

  const addToCartHandler = () => {
    if (!isAuthenticated) {
      navigate("/users/login");
      return;
    }

    if (fooditem.stock === 0) {
      alert("Item is out of stock");
      return;
    }

    dispatch(addItemToCart(fooditem._id, restaurant, quantity));
  };

  const deleteFoodItem = async () => {
    if (!window.confirm("Delete this food item?")) return;

    try {
      await api.delete(`/v1/eats/item/${fooditem._id}`);

      if (restaurant) {
        dispatch(getMenus(restaurant));
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Unable to delete item");
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={fooditem.images?.[0]?.url || "/images/placeholder.png"}
          alt={fooditem.name}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{fooditem.name}</h5>
          <p className="fooditem_des">{fooditem.description}</p>

          <p className="card-text">
            <FontAwesomeIcon icon={faIndianRupeeSign} size="xs" />
            {fooditem.price}
          </p>

          {!isAdmin &&
            (!showButtons ? (
              <button
                id="cart_btn"
                className="btn btn-primary ml-4"
                disabled={fooditem.stock === 0}
                onClick={addToCartHandler}
              >
                Add to Cart
              </button>
            ) : (
              <div className="stockCounter d-inline">
                <span className="btn btn-danger minus" onClick={decreaseQty}>
                  -
                </span>

                <input
                  type="number"
                  className="form-control count d-inline"
                  value={quantity}
                  readOnly
                />

                <span className="btn btn-primary plus" onClick={increaseQty}>
                  +
                </span>
              </div>
            ))}

          <hr />

          <p>
            Status:
            <span className={fooditem.stock > 0 ? "greenColor" : "redColor"}>
              {fooditem.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          {isAuthenticated && isAdmin && (
            <button className="btn btn-danger btn-sm mt-2" onClick={deleteFoodItem}>
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fooditem;
