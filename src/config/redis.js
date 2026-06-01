import Redis from "ioredis";
import env from "./env.js";
import logger from "../api/utils/logger.js";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});

redis.on("connecting", () => {
  logger.info("Redis connecting...");
});

redis.on("connect", () => {
  logger.info("Redis connected");
});

redis.on("error", (error) => {
  logger.error(`Error connecting to redis. ${error.message}`, { error });
});

export default redis;
