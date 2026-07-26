const mongoose = require("mongoose");

const connectDatabase = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_LOCAL_URI);

    console.log(
      `MongoDB Connected: ${con.connection.host}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Stop server if DB fails
  }
};

module.exports = connectDatabase;