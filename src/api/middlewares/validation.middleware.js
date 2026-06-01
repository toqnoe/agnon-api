import * as yup from "yup";
import ValidationError from "../utils/errors/ValidationError.js";

const validate = (schema) => async (req, res, next) => {
  try {
    if (schema.body) {
      req.body = await schema.body.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    if (schema.query) {
      req.query = await schema.query.validate(req.query, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    if (schema.params) {
      req.params = await schema.params.validate(req.params, {
        abortEarly: false,
        stripUnknown: true,
      });
    }

    next();
  } catch (error) {
    if (!(error instanceof yup.ValidationError)) {
      return next(error);
    }

    const details = error.inner.map((err) => ({
      field: err.path,
      message: err.message,
    }));

    return next(new ValidationError("Validation failed", 400, details));
  }
};

export default validate;
