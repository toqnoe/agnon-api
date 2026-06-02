import express from "express";
import AuthController from "../../controllers/v1/auth.controller.js";
import AuthValidator from "../../validators/auth.validator.js";
import validate from "../../middlewares/validation.middleware.js";

const router = express.Router();

// Routes
router.post(
  "/register",
  validate(AuthValidator.register),
  AuthController.register,
);

router.post("/login", validate(AuthValidator.login), AuthController.login);

router.post("/refresh", AuthController.refresh);

router.post("/logout", AuthController.logout);

router.post("/logout-all", AuthController.logoutAll);

export default router;
