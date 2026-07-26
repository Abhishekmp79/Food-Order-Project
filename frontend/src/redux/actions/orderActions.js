import api from "../../utils/api";
import {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  paymentRequest,
  paymentSuccess,
  paymentFail,
  myOrderRequest,
  myOrderSuccess,
  myOrderFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
} from "../slices/orderSlice";

export const createOrder = (session_id) => async (dispatch) => {
  try {
    dispatch(createOrderRequest());

    const { data } = await api.post(
      "/v1/eats/orders/new",
      { session_id },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    dispatch(createOrderSuccess(data.order));
  } catch (error) {
    dispatch(
      createOrderFail(error.response?.data?.message || "Failed to create order")
    );
  }
};

export const payment = (items, restaurant) => async (dispatch) => {
  try {
    dispatch(paymentRequest());

    const { data } = await api.post(
      "/v1/payment/process",
      {
        items,
        restaurant,
        frontendUrl: window.location.origin,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (data.url) {
      window.location.assign(data.url);
    }

     dispatch(paymentSuccess())
  } catch (error) {
    dispatch(paymentFail(error.response?.data?.message || "Payment failed"));
  }
};

export const myOrders = () => async (dispatch) => {
  try {
    dispatch(myOrderRequest());

    const { data } = await api.get("/v1/eats/orders/me/myorders");
    dispatch(myOrderSuccess(data.orders));
  } catch (error) {
    dispatch(myOrderFail(error.response?.data?.message || "Failed to load orders"));
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());

    const { data } = await api.get(`/v1/eats/orders/${id}`);
    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(
      orderDetailsFail(
        error.response?.data?.message || "Failed to load order details"
      )
    );
  }
};
