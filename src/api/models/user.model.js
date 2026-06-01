import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import env from "../../config/env.js";

// Utils

const transform = (doc, ret) => {
  const { _id } = ret;

  return {
    id: _id.toString(),
    name: ret.name,
    email: ret.email,
  };
};

const userSchema = new mongoose.Schema(
  {
    // Details
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // Status
    verified: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    // Security
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toObject: { transform },
    toJSON: { transform },
  },
);

// Hash modified password
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, env.PASSWORD_HASH_SALT);
  }
});

// Verify password validity
userSchema.methods.verifyPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
