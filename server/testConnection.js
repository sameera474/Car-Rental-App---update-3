// server/testConnection.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const connectTest = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    process.exit(0);
  } catch (error) {
    console.error("Connection error:", error);
    process.exit(1);
  }
};

connectTest();
