const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDatabase = require("../config/database");
const User = require("../models/user");

dotenv.config({ path: path.resolve(__dirname, "../config/config.env") });

const [, , email, role = "admin"] = process.argv;

const validRoles = ["user", "restaurant-owner", "admin"];

const run = async () => {
  if (!email) {
    throw new Error("Usage: node utils/setUserRole.js <email> [role]");
  }

  const normalizedRole = String(role).trim().toLowerCase();

  if (!validRoles.includes(normalizedRole)) {
    throw new Error(
      `Invalid role "${role}". Allowed roles: ${validRoles.join(", ")}`
    );
  }

  await connectDatabase();

  const user = await User.findOne({ email: String(email).trim().toLowerCase() });

  if (!user) {
    throw new Error(`User not found for email: ${email}`);
  }

  user.role = normalizedRole;
  await user.save({ validateBeforeSave: false });

  console.log(`Updated ${user.email} to role "${user.role}"`);
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error(error.message);

  try {
    await mongoose.connection.close();
  } catch {
    // ignore close errors during failure cleanup
  }

  process.exit(1);
});
