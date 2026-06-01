import asyncHandler from "express-async-handler";
import UserService from "../../services/v1/user.service.js";

class UserController {
  static getMe = asyncHandler(async (req, res) => {
    res
      .status(200)
      .json({ success: true, message: "User data retrieved", data: req.user });
  });

  static updateMe = asyncHandler(async (req, res) => {
    const userData = req.user;
    const inputData = req.body;

    const { message, data } = await UserService.updateMe(userData, inputData);

    res.status(200).json({ success: true, message, data });
  });

  static deleteMe = asyncHandler(async (req, res) => {
    const userData = req.user;

    const { message } = await UserService.deleteMe(userData);

    res.status(200).json({ success: true, message });
  });
}

export default UserController;
