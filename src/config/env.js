import logger from "../api/utils/logger.js";

const required = [
  "DATABASE_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  ...(process.env.NODE_ENV === "production" ? ["REDIS_CLOUD_URL"] : []),
];

required.forEach((var_) => {
  if (!process.env[var_] || process.env[var_] === "") {
    logger.error(`Required env variable ${var_} not configured`);
    process.exit(1);
  }
});

const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URI: process.env.DATABASE_URI,
  PASSWORD_HASH_SALT: Number(process.env.PASSWORD_HASH_SALT || 10),
  SERVICE: process.env.SERVICE || "corran-api",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",

  REDIS_CLOUD_URL: process.env.REDIS_CLOUD_URL,
  REDIS_LOCAL_URL: "redis://localhost:6379",
};

export default Object.freeze(env);
