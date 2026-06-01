import logger from "../utils/logger.js";
import env from "../../config/env.js";
import ApiError from "../utils/errors/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next();

  const apiError = !(err instanceof ApiError)
    ? new ApiError(err.message || "Something went wrong", err.statusCode || 500)
    : err;

  apiError.code = err.code || apiError.code;
  apiError.stack = err.stack || new Error().stack;

  // Log error
  logger.error(apiError.message, {
    name: apiError.name,
    statusCode: apiError.statusCode,
    code: apiError.code,
    ...(apiError.details !== null && { details: apiError.details }),
    stack: apiError.stack,
  });

  res.status(apiError.statusCode).json({
    success: false,
    code: apiError.code,
    message: apiError.message,
    ...(apiError.details !== null && { details: apiError.details }),
    ...(env.NODE_ENV === "development" && { stack: apiError.stack }),
  });
};

export default errorHandler;
