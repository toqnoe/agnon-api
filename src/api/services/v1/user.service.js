import User from "../../models/user.model.js";
import ApiError from "../../utils/errors/ApiError.js";
import ValidationError from "../../utils/errors/ValidationError.js";

class UserService {
  static updateMe = async (userData, inputData) => {
    const { name, email } = inputData;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        userData.id,
        {
          ...(name && { name }),
          ...(email && { email }),
        },
        { returnDocument: "after" },
      );

      return {
        message: "User updated",
        data: updatedUser.toObject(),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new ValidationError("Email already in use");
      }

      throw new ApiError(error.message || "Updating user failed", 500);
    }
  };

  static deleteMe = async (userData) => {
    await User.findByIdAndUpdate(userData.id, { deleted: true });

    return { message: "User deleted" };
  };
}

export default UserService;
