import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  sortByRatings,
  sortByReviews,
  toggleVegOnly,
} from "../redux/slices/restaurantSlice";
import {
  createRestaurant,
  getRestaurants,
} from "../redux/actions/restaurantActions";
import CountRestaurant from "./CountRestaurant";
import Loader from "./layout/Loader";
import Message from "./Message";
import Restaurant from "./Restaurant";

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [restaurantForm, setRestaurantForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
    latitude: "",
    longitude: "",
    isVeg: false,
  });

  const {
    loading,
    error,
    restaurants = [],
    showVegOnly,
    creating,
    createError,
  } = useSelector((state) => state.restaurants);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getRestaurants(keyword || ""));
  }, [dispatch, keyword]);

  const visibleRestaurants = showVegOnly
    ? restaurants.filter((restaurant) => restaurant.isVeg)
    : restaurants;

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();

    const latitude = Number(restaurantForm.latitude);
    const longitude = Number(restaurantForm.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      alert("Please enter valid latitude and longitude");
      return;
    }

    const payload = {
      name: restaurantForm.name.trim(),
      address: restaurantForm.address.trim(),
      isVeg: restaurantForm.isVeg,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      images: restaurantForm.imageUrl.trim()
        ? [
            {
              public_id: `manual-${Date.now()}`,
              url: restaurantForm.imageUrl.trim(),
            },
          ]
        : [],
    };

    try {
      await dispatch(createRestaurant(payload)).unwrap();
      await dispatch(getRestaurants(keyword || ""));
      setShowCreateModal(false);
      setRestaurantForm({
        name: "",
        address: "",
        imageUrl: "",
        latitude: "",
        longitude: "",
        isVeg: false,
      });
    } catch {
      // Error is already stored in Redux for the UI to show.
    }
  };

  return (
    <>
      <CountRestaurant />

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <section>
          <div className="d-flex flex-wrap justify-content-between align-items-center">
            <div className="sort">
              <button
                className="sort_veg p-3"
                onClick={() => dispatch(toggleVegOnly())}
              >
                {showVegOnly ? "Show All" : "Pure Veg"}
              </button>

              <button
                className="sort_rev p-3"
                onClick={() => dispatch(sortByReviews())}
              >
                Sort By Reviews
              </button>

              <button
                className="sort_rate p-3"
                onClick={() => dispatch(sortByRatings())}
              >
                Sort By Ratings
              </button>
            </div>

            {isAuthenticated && user?.role === "admin" && (
              <button
                className="btn btn-primary my-2"
                onClick={() => setShowCreateModal(true)}
              >
                + Add Restaurant
              </button>
            )}
          </div>

          <div className="row mt-4">
            {visibleRestaurants.length > 0 ? (
              visibleRestaurants.map((restaurant) => (
                <Restaurant
                  key={restaurant._id}
                  restaurant={restaurant}
                />
              ))
            ) : (
              <div className="col-12">
                <Message variant="info">No restaurants found.</Message>
              </div>
            )}
          </div>

          {showCreateModal && (
            <div className="create-modal">
              <div className="create-content">
                <h3>Add Restaurant</h3>

                {createError && <Message variant="danger">{createError}</Message>}

                <form onSubmit={handleCreateRestaurant}>
                  <div className="form-group">
                    <label>Restaurant Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={restaurantForm.name}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <textarea
                      className="form-control"
                      value={restaurantForm.address}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      rows="3"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={restaurantForm.imageUrl}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          imageUrl: e.target.value,
                        }))
                      }
                      placeholder="Optional"
                    />
                  </div>

                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      className="form-control"
                      step="any"
                      value={restaurantForm.latitude}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          latitude: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      className="form-control"
                      step="any"
                      value={restaurantForm.longitude}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          longitude: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="form-group form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="isVegRestaurant"
                      checked={restaurantForm.isVeg}
                      onChange={(e) =>
                        setRestaurantForm((prev) => ({
                          ...prev,
                          isVeg: e.target.checked,
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="isVegRestaurant">
                      Pure Veg Restaurant
                    </label>
                  </div>

                  <button className="btn btn-primary" type="submit" disabled={creating}>
                    {creating ? "Creating..." : "Create"}
                  </button>

                  <button
                    className="btn btn-secondary ml-2"
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={creating}
                  >
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default Home;
