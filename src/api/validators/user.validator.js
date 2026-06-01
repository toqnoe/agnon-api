import * as yup from "yup";

class UserValidator {
  // Fields

  static name = yup
    .string()
    .min(3, "Name must be at least 3 chars")
    .trim()
    .optional();

  static email = yup.string().email("Email must be a valid one").optional();

  // Schemas

  static updateMe = {
    body: yup.object({
      name: this.name,
      email: this.email,
    }),
  };
}

export default UserValidator;
