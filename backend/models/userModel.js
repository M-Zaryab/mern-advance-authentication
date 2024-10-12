import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now() },
    resetPasswordToken: { type: String },
    resetPasswordTokenExpiry: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    // refreshToken: { type: String, required: true },
    // refreshTokenExpiry: { type: Date, required: true },
    // forgetPasswordToken: { type: String, required: true },
    // forgetPasswordTokenExpiry: { type: Date, required: true },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
