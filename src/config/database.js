import mongoose from "mongoose";
import env from "./env.js";
import logger from "../api/utils/logger.js";

const connectDB = async () => {
  mongoose.connection.on("connecting", () => {
    logger.info("Database connecting...");
  });

  mongoose.connection.on("connected", () => {
    logger.info("Database connected");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("Database disconnected");
  });

  mongoose.connection.on("error", () => {
    logger.error("Database connection error");
  });

  try {
    await mongoose.connect(env.DATABASE_URI);
  } catch (error) {
    logger.error(`Error connecting to database. ${error.message}`, { error });
    process.exit(1);
  }
};

export default connectDB;
