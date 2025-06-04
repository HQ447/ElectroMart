import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Database is connected successfully!!!");
  } catch (error) {
    console.log("Error in Connecting Database", error);
  }
};

export default connectDB;
