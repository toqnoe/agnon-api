import { createClient } from "redis";
import env from "./env.js";
import logger from "../api/utils/logger.js";

const redisConfig =
  env.NODE_ENV === "production"
    ? {
        username: env.REDIS_USERNAME,
        password: env.REDIS_PASSWORD,
        socket: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      }
    : {
        host: "127.0.0.1",
        port: 6379,
      };

const redis = createClient(redisConfig);

redis.on("connect", () => {
  logger.info("Redis connecting...");
});

redis.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

await redis.connect();
logger.info("Redis connected");

export default redis;
