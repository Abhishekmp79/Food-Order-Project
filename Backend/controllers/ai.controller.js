const catchAsync = require("../middlewares/catchAsyncErrors");
const aiService = require("../services/ai.service");
const FoodItem = require("../models/foodItem");
const Restaurant = require("../models/restaurant");
const { analyzeReviewsWithAI } = require("../services/aiReviewAnalyzer");

const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value ? [value] : [];
};

exports.generateFoodAI = catchAsync(async (req, res) => {
  const { name, category, spiceLevel, price } = req.body;

  if (!name || !category || !spiceLevel || price === undefined || price === null) {
    return res.status(400).json({
      success: false,
      message: "name, category, spiceLevel and price are required",
    });
  }

  const aiData = await aiService.generateDishDescription({
    name,
    category,
    spiceLevel,
    price,
  });

  res.status(200).json({
    success: true,
    data: aiData,
  });
});

exports.generateAndSaveFoodAI = catchAsync(async (req, res) => {
  const { foodId } = req.params;
  const { category = "Veg", spiceLevel = "Medium" } = req.body;

  const food = await FoodItem.findById(foodId);

  if (!food) {
    return res.status(404).json({
      success: false,
      message: "Food item not found",
    });
  }

  const aiData = await aiService.generateDishDescription({
    name: food.name,
    category: food.category || category,
    spiceLevel: food.spiceLevel || spiceLevel,
    price: food.price,
  });

  food.aiDescription = aiData.description || "";
  food.aiTags = toStringArray(aiData.tags);
  food.aiAllergens = toStringArray(aiData.allergens);
  food.aiServes = toStringArray(aiData.serves);
  food.aiBestFor = toStringArray(aiData.bestFor);

  await food.save();

  res.status(200).json({
    success: true,
    message: "AI metadata generated and saved",
    data: aiData,
  });
});

exports.analyzeRestaurantReviews = catchAsync(async (req, res) => {
  const { id } = req.params;
  const restaurant = await Restaurant.findById(id);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: "Restaurant not found",
    });
  }

  if (!restaurant.reviews?.length) {
    return res.status(404).json({
      success: false,
      message: "No reviews to analyze",
    });
  }

  const aiData = await analyzeReviewsWithAI(restaurant.reviews);

  restaurant.reviewSentiment = aiData.sentiment;
  restaurant.reviewSummaryBullets = toStringArray(aiData.summaryBullets);
  restaurant.reviewTopMentions = toStringArray(aiData.topMentions);

  await restaurant.save();

  res.status(200).json({
    success: true,
    data: aiData,
  });
});
