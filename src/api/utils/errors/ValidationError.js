import ApiError from "./ApiError.js";

class ValidationError extends ApiError {
  constructor(message = "Validation error", statusCode = 400, details = null) {
    super(message, statusCode, details);

    this.code = "VALIDATION_ERROR";
  }
}

export default ValidationError;
