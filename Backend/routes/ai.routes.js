const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");

router.get("/test", (req, res) => {
  res.send("AI route working");
});

router.post("/generate", aiController.generateFoodAI);
router.post("/genarate-food-ai", aiController.generateFoodAI);

router.post("/generate/:foodId", aiController.generateAndSaveFoodAI);
router.post("/genarate-food-ai/:foodId", aiController.generateAndSaveFoodAI);

router.post("/analyze-reviews/:id", aiController.analyzeRestaurantReviews);
router.put(
  "/admin/restaurants/:id/analyze",
  aiController.analyzeRestaurantReviews
);

module.exports = router;
