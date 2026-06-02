import User from "../../models/user.model.js";
import ApiError from "../../utils/errors/ApiError.js";
import AuthenticationError from "../../utils/errors/AuthenticationError.js";
import ValidationError from "../../utils/errors/ValidationError.js";
import Jwt from "../../utils/Jwt.js";

class AuthService {
  static register = async (inputData) => {
    const { name, email, password } = inputData;

    try {
      // Create user
      const newUser = await User.create({ name, email, password });

      return { message: "User registered", data: newUser.toObject() };
    } catch (error) {
      if (error.code === 11000) {
        throw new ValidationError("Email already registered");
      }

      if (!(error instanceof ApiError)) {
        throw new ApiError(error.message || "User registration failed", 400);
      }

      throw error;
    }
  };

  static login = async (inputData) => {
    const { email, password } = inputData;

    // Retrieve user data
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.verifyPassword(password)) || user.deleted) {
      throw new ValidationError("Invalid credentials");
    }

    const payload = {
      sub: user._id,
      tokenVersion: user.tokenVersion,
    };

    const [accessToken, refreshToken] = await Promise.all([
      Jwt.generateToken(payload),
      Jwt.generateToken(payload, "refresh"),
    ]);

    return {
      message: "User logged in",
      tokens: { accessToken, refreshToken },
      data: user.toObject(),
    };
  };

  static refresh = async (refreshToken) => {
    if (!refreshToken) {
      throw new AuthenticationError("Refresh token not provided");
    }

    const decoded = await Jwt.verifyToken(refreshToken, "refresh");

    // Generate new tokens
    const payload = {
      sub: decoded.sub,
      tokenVersion: decoded.tokenVersion,
    };

    const [newAccessToken, newRefreshToken] = await Promise.all([
      Jwt.generateToken(payload),
      Jwt.generateToken(payload, "refresh"),
    ]);

    await Jwt.revokeRefreshToken(decoded.jti);

    return {
      message: "Tokens refreshed",
      tokens: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    };
  };
}

export default AuthService;
