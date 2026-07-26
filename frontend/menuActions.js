import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const Restaurant = ({ restaurant }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(restaurant.likes ?? 0);

  const toggleLike = () => {
    setLiked((prevLiked) => {
      const nextLiked = !prevLiked;
      setLikeCount((prevCount) => prevCount + (nextLiked ? 1 : -1));
      return nextLiked;
    });
  };

  return (
    <div className="col-sm-12 col-md-6 col-lg-3 my-3">
      <div className="card p-3 rounded">
        <Link
          to={`/eats/stores/${restaurant._id}/menus`}
          className="btn btn-block"
        >
          <img
            className="card-img-top mx-auto"
            src={restaurant.images?.[0]?.url || "/images/placeholder.png"}
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
                style={{ width: `${(restaurant.ratings / 5) * 100}%` }}
              ></div>
            </div>

            <span id="no_of_reviews">
              ({restaurant.numOfReviews} Reviews)
            </span>

            <div className="restaurant-like mt-3">
              <button
                type="button"
                className={`btn btn-sm ${liked ? "btn-danger" : "btn-outline-danger"}`}
                onClick={toggleLike}
              >
                <FontAwesomeIcon icon={faHeart} /> {likeCount}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Restaurant;