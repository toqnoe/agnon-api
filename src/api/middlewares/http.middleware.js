import morgan from "morgan";
import logger from "../utils/logger.js";

const httpLogger = () =>
  morgan((tokens, req, res) => {
    logger.http("HTTP Request", {
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: Number(tokens.status(req, res)),
      contentLength: Number(tokens.res(req, res, "content-length")) || 0,
      responseTime: Number(
        (Number(tokens["response-time"](req, res)) || 0).toFixed(2),
      ),
      ip: tokens["remote-addr"](req, res),
      referrer: tokens.referrer(req, res),
      userAgent: tokens["user-agent"](req, res),
    });

    return undefined;
  });

export default httpLogger;
