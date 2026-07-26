const express = require('express');
const router = express.Router();

const { getSingleOrder, allOrders, newOrder, myOrders } = require("../controllers/orderController");
const authController = require("../controllers/authController");

router.route("/new").post(authController.protect, newOrder);
router.route("/:id").get(authController.protect, getSingleOrder);
router.route("/me/myorders").get(authController.protect, myOrders);

module.exports = router;
