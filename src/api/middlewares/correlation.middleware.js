import crypto from "crypto";
import Context from "../utils/Context.js";

const correlationId = () => (req, res, next) => {
  const id =
    req.headers["x-correlation-id"] || crypto.randomBytes(8).toString("hex");

  Context.setStore({ correlationId: id }, () => {
    req.correlationId = id;
    res.setHeader("X-Correlation-ID", id);
    next();
  });
};

export default correlationId;
