const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const { analyzeReviewsWithAI } = require("../services/aiReviewAnalyzer");

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
};

const ensureRestaurantInsights = async (restaurant) => {
  if (
    !restaurant ||
    restaurant.reviewSentiment ||
    !restaurant.reviews ||
    restaurant.reviews.length === 0
  ) {
    return restaurant;
  }

  try {
    const aiData = await analyzeReviewsWithAI(restaurant.reviews);

    restaurant.reviewSentiment = aiData.sentiment;
    restaurant.reviewSummaryBullets = toStringArray(aiData.summaryBullets);
    restaurant.reviewTopMentions = toStringArray(aiData.topMentions);

    await restaurant.save();
  } catch (error) {
    console.error(
      `Failed to generate AI insights for restaurant ${restaurant._id}: ${error.message}`
    );
  }

  return restaurant;
};

exports.getAllRestaurants = catchAsync(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Restaurant.find(), req.query)
    .search()
    .sort();
  const restaurants = await apiFeatures.query;

  await Promise.all(restaurants.map((restaurant) => ensureRestaurantInsights(restaurant)));

  res.status(200).json({
    status: "success",
    count: restaurants.length,
    restaurants: restaurants,
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create(req.body);
  res.status(201).json({
    status: "success",
    data: restaurant,
  });
});

//Get restaurant by id
exports.getRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findById(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No Restaurant found with that ID", 404));

  await ensureRestaurantInsights(restaurant);

  res.status(200).json({
    status: "success",
    data: restaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

  if (!restaurant)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(204).json({
    status: "success",
  });
});
