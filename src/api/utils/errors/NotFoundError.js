import ApiError from "./ApiError.js";

class NotFoundError extends ApiError {
  constructor(message = "Resource not found") {
    super(message, 404);

    this.code = "NOT_FOUND_ERROR";
  }
}

export default NotFoundError;
