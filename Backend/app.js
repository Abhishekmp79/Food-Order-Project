const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const errorMiddleware = require("./middlewares/errors");
// Middlewares
app.use(cors());
app.use(express.json({ limit: "1000kb" }));
app.use(express.urlencoded({ extended: true, limit: "1000kb" }));
app.use(cookieParser());
app.use(fileUpload());

// Routes
const foodRouter = require("./routes/foodItem.js");
const restaurant = require("./routes/restaurant.js");
const menuRouter = require("./routes/menu.js");
const order = require("./routes/order.js");
const auth = require("./routes/auth.js");
const payment = require("./routes/payment.js");
const cart = require("./routes/cart.js");
const aiRouter = require("./routes/ai.routes.js");

app.use("/api/v1/eats", foodRouter);
app.use("/api/v1/eats/menus", menuRouter);
app.use("/api/v1/eats/stores", restaurant);
app.use("/api/v1/eats/orders", order);
app.use("/api/v1/users", auth);
app.use("/api/v1", payment);
app.use("/api/v1/eats/cart", cart);
app.use("/api/v1/eats/ai", aiRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on this server!`,
    });
});
app.use((req, res, next) => {
    console.log("🔥 HIT:", req.method, req.originalUrl);
    next();
});

// Error middleware
app.use(errorMiddleware);

module.exports = app;