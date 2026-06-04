import Redis from "ioredis";
import env from "./env.js";
import logger from "../api/utils/logger.js";

const REDIS_URL =
  env.NODE_ENV === "production" ? env.REDIS_CLOUD_URL : env.REDIS_LOCAL_URL;

const redis = new Redis(REDIS_URL);

redis.on("connecting", () => {
  logger.info("Redis connecting...");
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

export default redis;
