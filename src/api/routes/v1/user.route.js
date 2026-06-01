import express from "express";
import authenticate from "../../middlewares/auth.middleware.js";
import UserController from "../../controllers/v1/user.controller.js";
import UserValidator from "../../validators/user.validator.js";
import validate from "../../middlewares/validation.middleware.js";

const router = express.Router();

// Routes
router.get("/me", authenticate, UserController.getMe);

router.patch(
  "/me",
  authenticate,
  validate(UserValidator.updateMe),
  UserController.updateMe,
);

router.delete("/me", authenticate, UserController.deleteMe);

export default router;
