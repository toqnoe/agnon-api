import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import compression from "compression";
import correlationId from "./api/middlewares/correlation.middleware.js";
import httpLogger from "./api/middlewares/http.middleware.js";
import notFoundHandler from "./api/middlewares/notfound.middleware.js";
import errorHandler from "./api/middlewares/error.middleware.js";
import router from "./api/routes/index.js";

const app = express();

// Global middlewares
app.use(cors());
app.use(helmet());
app.use(correlationId());
app.use(httpLogger());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// Routes
app.use("/", router);

// Error middlewares
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
