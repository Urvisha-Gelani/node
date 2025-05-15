// config/db.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import logger from "../utils/logger.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("✅ MongoDB connected");
  } catch (err) {
    logger.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
