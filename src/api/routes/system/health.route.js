import express from "express";
import HealthController from "../../controllers/system/health.controller.js";

const router = express.Router();

// Routes
router.get("/", HealthController.getHealth);

export default router;
