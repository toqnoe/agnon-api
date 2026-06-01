import express from "express";
import RootController from "../../controllers/system/root.controller.js";

const router = express.Router();

// Routes
router.get("/", RootController.getAppInfo);

export default router;
