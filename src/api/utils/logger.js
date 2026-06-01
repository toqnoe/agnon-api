import fs from "fs";
import path from "path";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import Context from "./Context.js";

const LOG_DIR = path.resolve("logs");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const colors = {
  reset: "\x1b[0m", // default/reset
  error: "\x1b[31m", // red
  warn: "\x1b[33m", // yellow
  info: "\x1b[32m", // green
  http: "\x1b[36m", // cyan

  colorLevel: function (level) {
    return `${this[level]}${level.toUpperCase()}${this.reset}`;
  },

  colorStatus: function (status) {
    if (status >= 500) {
      return `${this.error}${status}${this.reset}`;
    } else if (status >= 400) {
      return `${this.warn}${status}${this.reset}`;
    } else if (status >= 200) {
      return `${this.info}${status}${this.reset}`;
    } else {
      return status;
    }
  },
};

const formats = {
  // Console format
  console: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...meta } = info;

      const STORE = Context.getStore();

      const correlationId =
        STORE !== null && typeof STORE === "object"
          ? STORE.correlationId
          : null;

      const prefix = correlationId
        ? ` [${correlationId}] ${message}`
        : ` ${message}`;

      if (level === "http" && meta !== null) {
        const { method, url, status, responseTime, contentLength, ip } = meta;

        return `${timestamp} [${colors.colorLevel(level)}]: [${correlationId}] ${method} ${url} ${colors.colorStatus(status)} ${responseTime}ms - ${contentLength} | ${ip}`;
      }

      return `${timestamp} [${colors.colorLevel(level)}]:${prefix}`;
    }),
  ),

  // File format
  file: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const { timestamp, level, message, ...meta } = info;
      const subMeta = {
        environment: process.env.NODE_ENV,
        service: process.env.SERVICE,
      };

      const STORE = Context.getStore();

      const correlationId =
        STORE !== null && typeof STORE === "object"
          ? STORE.correlationId
          : null;

      return JSON.stringify({
        timestamp,
        level,
        ...(correlationId !== null && { correlationId }),
        message,
        ...meta,
        ...subMeta,
      });
    }),
  ),
};

const logger = winston.createLogger({
  level: "http",
  transports: [
    new winston.transports.Console({ format: formats.console }),
    new DailyRotateFile({
      format: formats.file,
      dirname: LOG_DIR,
      datePattern: "YYYY-MM-DD",
      filename: "%DATE%.log",
      zippedArchive: true,
      maxFiles: "7d",
      maxSize: "20m",
    }),
  ],
});

export default logger;
