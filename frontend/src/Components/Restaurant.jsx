import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  analyzeReviews,
  deleteRestaurant,
} from "../redux/actions/restaurantActions";

const Restaurant = ({ restaurant }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user || {});
  const { analyzingRestaurantId } = useSelector(
    (state) => state.restaurants || {}
  );
  const isAnalyzing = analyzingRestaurantId === restaurant._id;
  const hasReviews =
    (restaurant.reviews && restaurant.reviews.length > 0) ||
    restaurant.numOfReviews > 0;

  const handleDelete = async () => {
    if (!window.confirm("Delete this restaurant?")) return;

    try {
      await dispatch(deleteRestaurant(restaurant._id)).unwrap();
    } catch {
      alert("Unable to delete");
    }
  };

  const handleAnalyzeReviews = async () => {
    try {
      await dispatch(analyzeReviews(restaurant._id)).unwrap();
    } catch (error) {
      alert(error || "Unable to generate AI insights");
    }
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <Link to={`/eats/stores/${restaurant._id}/menus`}>
          <img
            className="card-img-top mx-auto"
            src={restaurant.images?.[0]?.url || "/images/template.jpeg"}
            alt={restaurant.name}
          />
        </Link>

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{restaurant.name}</h5>
          <p className="rest_address">{restaurant.address}</p>

          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{
                  width: `${(restaurant.ratings / 5) * 100}%`,
                }}
              ></div>
            </div>
            <span>({restaurant.numOfReviews} Reviews)</span>
          </div>

          {restaurant.reviewSentiment && (
            <div className="mt-2 p-2 border rounded bg-light">
              <strong>AI Insights</strong>

              <p>
                Sentiment: <b>{restaurant.reviewSentiment}</b>
              </p>

              <ul>
                {(restaurant.reviewSummaryBullets || []).map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <small>
                Top: {(restaurant.reviewTopMentions || []).join(", ")}
              </small>
            </div>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <>
              <button
                className="btn btn-info btn-sm mt-2"
                onClick={handleAnalyzeReviews}
                disabled={!hasReviews || isAnalyzing}
              >
                {isAnalyzing
                  ? "Generating..."
                  : restaurant.reviewSentiment
                    ? "Refresh AI Insights"
                    : "Generate AI Insights"}
              </button>

              <button
                className="btn btn-danger btn-sm mt-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
