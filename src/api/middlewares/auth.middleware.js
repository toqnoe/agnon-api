import User from "../models/user.model.js";
import AuthenticationError from "../utils/errors/AuthenticationError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";
import Jwt from "../utils/Jwt.js";

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthenticationError("Access token not provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = await Jwt.verifyToken(token);

  const user = await User.findOne({ _id: decoded.sub, deleted: false });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  req.user = user;
  next();
};

export default authenticate;
