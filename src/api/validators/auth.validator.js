import * as yup from "yup";

class AuthValidator {
  // Fields

  static name = yup
    .string()
    .min(3, "Name must be at least 3 chars")
    .trim()
    .required("Name is required");

  static email = yup
    .string()
    .email("Email must be a valid one")
    .required("Email is required");

  static password = yup
    .string()
    .min(8, "Password must be at least 8 chars")
    .required("Password is required");

  // Schemas

  static register = {
    body: yup.object({
      name: this.name,
      email: this.email,
      password: this.password,
    }),
  };

  static login = {
    body: yup.object({
      email: this.email,
      password: this.password,
    }),
  };
}

export default AuthValidator;
