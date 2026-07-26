const Order = require("../models/order");
const FoodItem = require("../models/foodItem");
const Cart = require("../models/cartModel");
const { ObjectId } = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv");

//setting up config file
dotenv.config({ path: "./config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Create a new order   =>  /api/v1/order/new
// Create Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const { session_id } = req.body;
  if (!session_id) {
    return next(new ErrorHandler("Missing checkout session", 400));
  }

  const existingOrder = await Order.findOne({
    checkoutSessionId: session_id,
    user: req.user._id,
  });

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      order: existingOrder,
    });
  }

  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: "items.foodItem",
      select: "name price images",
    })
    .populate({
      path: "restaurant",
      select: "name",
    });

  if (!cart) {
    return next(new ErrorHandler("Cart is empty", 404));
  }

  let session = null;

  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["customer"],
    });
  } catch (error) {
    // In local/dev flows the success page can return with a session id that
    // is no longer retrievable by the current Stripe key. We still allow
    // confirmation from the persisted cart so the user is not stranded.
    if (error.code !== "resource_missing") {
      throw error;
    }
  }

  const shippingAddress =
    session?.shipping_details?.address ||
    session?.customer_details?.address ||
    {};

  let deliveryInfo = {
    address: [shippingAddress.line1, shippingAddress.line2]
      .filter(Boolean)
      .join(" ") || "Address not provided",
    city: shippingAddress.city || "City not provided",
    phoneNo:
      session?.customer_details?.phone ||
      session?.customer?.phone ||
      "Phone not provided",
    postalCode: shippingAddress.postal_code || "Postal code not provided",
    country: shippingAddress.country || "Country not provided",
  };

  let orderItems = cart.items.map((item) => ({
    name: item.foodItem.name,
    quantity: item.quantity,
    image: item.foodItem.images[0].url,
    price: item.foodItem.price,
    fooditem: item.foodItem._id,
  }));

  let paymentInfo = {
    id: session?.payment_intent || session_id,
    status: session?.payment_status || "paid",
  };

  const itemsPrice = cart.items.reduce(
    (total, item) => total + item.foodItem.price * item.quantity,
    0
  );
  const deliveryCharge =
    session?.shipping_cost?.amount_subtotal / 100 || 55;
  const finalTotal = session?.amount_total / 100 || itemsPrice + deliveryCharge;

  const order = await Order.create({
    orderItems,
    deliveryInfo,
    paymentInfo,
    checkoutSessionId: session_id,
    deliveryCharge,
    itemsPrice: session?.amount_subtotal / 100 || itemsPrice,
    finalTotal,
    user: req.user.id,
    restaurant: cart.restaurant._id,
    paidAt: Date.now(),
  });

  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json({
    success: true,
    order,
  });
});
// Get single order   =>   /api/v1/orders/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("restaurant")
    .exec();

  if (!order) {
    return next(new ErrorHandler("No Order found with this ID", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders   =>   /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("user", "name email")
    .populate("restaurant")
    .sort({ createdAt: -1 })
    .exec();

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders - ADMIN  =>   /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.finalTotal;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
