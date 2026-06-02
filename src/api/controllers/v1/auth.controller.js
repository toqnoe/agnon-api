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

const clearCookie = (res, name) => {
  res.clearCookie(name, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "development" ? "lax" : "none",
  });
};

class AuthController {
  // REGISTER

  static register = asyncHandler(async (req, res) => {
    const inputData = req.body;

    const { message, data } = await AuthService.register(inputData);

    // Log registration
    logger.info(
      `User ${data.id} registered at ${req.ip} using ${req.get("User-Agent")}`,
    );

    res.status(201).json({ success: true, message });
  });

  // LOGIN

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

  // REFRESH

  static refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    const { message, tokens } = await AuthService.refresh(refreshToken);

    setRefreshCookie(res, tokens.refreshToken);

    res.status(200).json({ success: true, message, token: tokens.accessToken });
  });

  // LOGOUT

  static logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    const { message, userId } = await AuthService.logout(refreshToken);

    clearCookie(res, "refreshToken");

    logger.info(
      userId
        ? `User ${userId} logged out at ${req.ip} using ${req.get("User-Agent")}`
        : "Logout request completed",
    );

    res.status(200).json({ success: true, message });
  });
}

export default AuthController;
