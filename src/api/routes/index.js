import express from "express";
import rootRouter from "./system/root.route.js";
import healthRouter from "./system/health.route.js";
import authRouter from "./v1/auth.route.js";
import userRouter from "./v1/user.route.js";

const router = express.Router();

// System routes
router.use("/", rootRouter);
router.use("/health", healthRouter);

// Version 1 routes
router.use("/v1/auth", authRouter);
router.use("/v1/users", userRouter);

export default router;
