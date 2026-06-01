import NotFoundError from "../utils/errors/NotFoundError.js";

const notFoundHandler = (req, res, next) => {
  next(new NotFoundError(`Cannot ${req.method} ${req.originalUrl}`));
};

export default notFoundHandler;
