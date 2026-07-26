// 🔑 Load env variables FIRST — before anything else!
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

// Now require app (cloudinary.config will see the loaded keys)
const app = require("./app");
const connectDatabase = require("./config/database");

// Handle Uncaught exceptions
process.on("uncaughtException", (err) => {
    console.log(`ERROR: ${err.stack}`);
    console.log("Shutting down server due to uncaught exception");
    process.exit(1);
});

// connect to database
connectDatabase();

// start the server
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down server due to Unhandled Promise rejection");
    server.close(() => process.exit(1));
});