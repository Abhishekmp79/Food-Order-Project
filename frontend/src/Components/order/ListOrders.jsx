import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../layout/Loader";
import { getRestaurants } from "../../redux/actions/restaurantActions";
import { myOrders } from "../../redux/actions/orderActions";
import { clearErrors } from "../../redux/slices/orderSlice";
import "./ListOrders.css";
import BackButton from "../layout/BackButton";

const ListOrders = () => {
  const dispatch = useDispatch();
  const { loading, error, orders = [] } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(myOrders());
    dispatch(getRestaurants());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "bottom-right" });
      dispatch(clearErrors());
    }
  }, [error, dispatch]);

  const data = orders.map((order) => ({
    id: order._id,
    restaurant: order.restaurant?.name || "Unknown",
    items: order.orderItems?.length || 0,
    amount: `Rs. ${order.finalTotal ?? 0}`,
    status: order.orderStatus || "Pending",
    date: order.createdAt
      ? new Date(order.createdAt).toLocaleDateString()
      : "N/A",
  }));

  return (
    <><BackButton to="/" /><div className="list-orders-container">
      <h1 className="orders-title">My Orders</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id}>
                    <td>{row.restaurant}</td>
                    <td>{row.items}</td>
                    <td>{row.amount}</td>
                    <td>
                      <span
                        className={row.status.includes("Delivered")
                          ? "status-delivered"
                          : "status-pending"}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>{row.date}</td>
                    <td>
                      <Link
                        to={`/eats/orders/${row.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div></>
  );
};

export default ListOrders;
