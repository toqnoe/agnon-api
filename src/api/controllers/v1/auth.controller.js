import asyncHandler from "express-async-handler";
import AuthService from "../../services/v1/auth.service.js";
import logger from "../../utils/logger.js";
import env from "../../../config/env.js";

// Utils

const setRefreshCookie = (res, value) => {
  res.cookie("refreshToken", value, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

class AuthController {
  static register = asyncHandler(async (req, res) => {
    const inputData = req.body;

    const { message, data } = await AuthService.register(inputData);

    // Log registration
    logger.info(
      `User ${data.id} registered at ${req.ip} using ${req.get("User-Agent")}`,
    );

    res.status(201).json({ success: true, message });
  });

  static login = asyncHandler(async (req, res) => {
    const inputData = req.body;

    const { message, tokens, data } = await AuthService.login(inputData);

    // Store refresh token cookie
    setRefreshCookie(res, tokens.refreshToken);

    // Log login
    logger.info(
      `User ${data.id} logged in at ${req.ip} using ${req.get("User-Agent")}`,
    );

    res
      .status(200)
      .json({ success: true, message, token: tokens.accessToken, data });
  });
}

export default AuthController;
