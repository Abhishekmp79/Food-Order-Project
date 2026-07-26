import api from "../../utils/api";
import {
  cartRequest,
  cartSuccess,
  cartFail,
  clearCart,
  updateCartSuccess,
  removeCartSuccess,
} from "../slices/cartSlice";

export const fetchCartItems = () => async (dispatch) => {
  try {
    dispatch(cartRequest());

    const { data } = await api.get("/v1/eats/cart/get-cart");
    dispatch(cartSuccess(data.data));
  } catch (error) {
    if (error.response?.status === 404) {
      dispatch(clearCart());
      return;
    }

    dispatch(cartFail(error.response?.data?.message || "Failed to fetch cart"));
  }
};

export const addItemToCart =
  (foodItemId, restaurantId, quantity) => async (dispatch, getState) => {
    try {
      dispatch(cartRequest());

      const { user } = getState().user;

      const { data } = await api.post("/v1/eats/cart/add-to-cart", {
        userId: user._id,
        foodItemId,
        restaurantId,
        quantity,
      });

      dispatch(cartSuccess(data.cart));
    } catch (error) {
      dispatch(cartFail(error.response?.data?.message || "Failed to add item"));
    }
  };

export const updateCartQuantity =
  (foodItemId, quantity) => async (dispatch, getState) => {
    try {
      const { user } = getState().user;

      const { data } = await api.post("/v1/eats/cart/update-cart-item", {
        userId: user._id,
        foodItemId,
        quantity,
      });

      dispatch(updateCartSuccess(data.cart));
    } catch (error) {
      dispatch(
        cartFail(error.response?.data?.message || "Failed to update cart")
      );
    }
  };

export const removeItemFromCart =
  (foodItemId) => async (dispatch, getState) => {
    try {
      const { user } = getState().user;

      const { data } = await api.delete("/v1/eats/cart/delete-cart-item", {
        data: { userId: user._id, foodItemId },
      });

      if (data.cart) {
        dispatch(removeCartSuccess(data));
      } else {
        dispatch(clearCart());
      }
    } catch (error) {
      dispatch(
        cartFail(error.response?.data?.message || "Failed to remove item")
      );
    }
  };
