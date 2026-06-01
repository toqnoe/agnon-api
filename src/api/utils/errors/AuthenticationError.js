import ApiError from "./ApiError.js";

class AuthenticationError extends ApiError {
  constructor(message) {
    super(message, 401);

    this.code = "AUTHENTICATION_ERROR";
  }
}

export default AuthenticationError;
