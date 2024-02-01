const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const connect = await mongoose
      .connect(process.env.CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("database connected successfully"));
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};
module.exports = connectDB;
