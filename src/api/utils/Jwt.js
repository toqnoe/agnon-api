import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../../config/env.js";
import redis from "../../config/redis.js";
import ApiError from "./errors/ApiError.js";
import AuthenticationError from "./errors/AuthenticationError.js";
import ValidationError from "./errors/ValidationError.js";
import User from "../models/user.model.js";
import logger from "./logger.js";

class Jwt {
  static generateId() {
    return crypto.randomBytes(8).toString("hex");
  }

  /**
   * Generate JWT
   * @param {object} payload
   * @param {"access" | "refresh"} type
   * @returns {Promise<string>}
   */
  static async generateToken(payload, type = "access") {
    const validTypes = ["access", "refresh"];

    if (!validTypes.includes(type)) {
      throw new ValidationError(
        'Invalid token type. Valid ones are "access" and "refresh"',
      );
    }

    if (!payload?.sub || typeof payload.tokenVersion !== "number") {
      throw new ValidationError(
        'Payload must include "sub" and "tokenVersion"',
      );
    }

    try {
      // Access token
      if (type === "access") {
        return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
          algorithm: "HS256",
          expiresIn: env.JWT_ACCESS_EXPIRES,
          jwtid: Jwt.generateId(),
          issuer: `${env.SERVICE}-api`,
          audience: `${env.SERVICE}-api-access`,
        });
      }

      // Refresh token
      const jti = Jwt.generateId();

      const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        algorithm: "HS256",
        expiresIn: env.JWT_REFRESH_EXPIRES,
        jwtid: jti,
        issuer: `${env.SERVICE}-api`,
        audience: `${env.SERVICE}-api-refresh`,
      });

      // Match this with JWT_REFRESH_EXPIRES
      const refreshTtl = 60 * 60 * 24 * 7;

      // Store refresh token in Redis
      await redis.set(`refresh:${jti}`, payload.sub, "EX", refreshTtl);

      logger.info("Refresh token stored in Redis");

      return token;
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof AuthenticationError
      ) {
        throw error;
      }

      throw new ApiError(error.message || "Failed to generate JWT", 500);
    }
  }

  /**
   * Verify JWT
   * @param {string} token
   * @param {"access" | "refresh"} type
   * @returns {Promise<object>}
   */
  static async verifyToken(token, type = "access") {
    const validTypes = ["access", "refresh"];

    if (!validTypes.includes(type)) {
      throw new ValidationError(
        'Invalid token type. Valid ones are "access" and "refresh"',
      );
    }

    if (!token) {
      throw new ValidationError("Token not provided");
    }

    try {
      // Access token
      if (type === "access") {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
          algorithms: ["HS256"],
          issuer: `${env.SERVICE}-api`,
          audience: `${env.SERVICE}-api-access`,
        });

        if (
          typeof decoded !== "object" ||
          !decoded.sub ||
          typeof decoded.tokenVersion !== "number"
        ) {
          throw new AuthenticationError("Invalid JWT payload");
        }

        return decoded;
      }

      // Refresh token
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET, {
        algorithms: ["HS256"],
        issuer: `${env.SERVICE}-api`,
        audience: `${env.SERVICE}-api-refresh`,
      });

      if (
        typeof decoded !== "object" ||
        !decoded.sub ||
        typeof decoded.tokenVersion !== "number" ||
        !decoded.jti
      ) {
        throw new AuthenticationError("Invalid JWT payload");
      }

      // Check Redis session
      const stored = await redis.get(`refresh:${decoded.jti}`);

      if (!stored || stored !== decoded.sub) {
        throw new AuthenticationError("Token revoked");
      }

      // Check token version
      const user = await User.findOne({
        _id: decoded.sub,
        tokenVersion: decoded.tokenVersion,
      }).select("_id email role tokenVersion");

      if (!user) {
        throw new AuthenticationError("Token version mismatch");
      }

      return {
        decoded,
        user: user.toObject(),
      };
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof ValidationError
      ) {
        throw error;
      }

      if (error.name === "TokenExpiredError") {
        throw new AuthenticationError("JWT expired");
      }

      if (error.name === "JsonWebTokenError") {
        throw new AuthenticationError("Invalid JWT");
      }

      throw new ApiError(error.message || "Failed to verify JWT", 500);
    }
  }

  /**
   * Revoke refresh token
   * @param {string} jti
   * @returns {Promise<void>}
   */
  static async revokeRefreshToken(jti) {
    await redis.del(`refresh:${jti}`);

    logger.info("Refresh token deleted");
  }
}

export default Jwt;
