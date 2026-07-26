import React from "react";
import { useSelector } from "react-redux";
import "./css/count.css";

const CountRestaurant = () => {
    const { restaurants, count, showVegOnly, loading, error } =
        useSelector((state) => state.restaurants);
    const pureVegCount = restaurants.filter((restaurant) => restaurant.isVeg).length;
    const displayCount = showVegOnly ? pureVegCount : count;

    return (
        <div>
            {loading ? (
                <p> Loading restaurant count...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <p className="NumOfRestro">
                    {displayCount}
                    <span className="Restro">
                        {displayCount === 1 ? " restaurant" : " restaurants"}
                    </span>
                </p>
            )}
            <hr></hr>
        </div>
    );
};

export default CountRestaurant;
