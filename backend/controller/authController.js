import bcryptjs from "bcryptjs";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { validateEmail } from "../utils/emialValidation.js";
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookies } from "../utils/generateTokenAndSetCookies.js";
import {
  sendForgotPasswordEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
} from "../mailtrap/email.js";
import crypto from "crypto";

export const signupController = asyncHandler(async (req, res) => {
  // accept data from body email, username, password
  // check data undefined
  // check if the user already exist
  // check email validation
  // hash passsword
  // save in database
  const { email, username, password } = req.body;

  if (!username || !password || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ $or: [{ username }, { email }] });

  if (user) {
    throw new ApiError(409, "User already exists");
  }

  if (!validateEmail(email)) {
    throw new ApiError(400, "Please enter a valid email address");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const verificationToken = Math.floor(
    100000 + Math.random() * 100000
  ).toString();

  const newUsername = username.trim().toLocaleLowerCase();
  const newUser = new User({
    username: newUsername,
    email,
    password: hashedPassword,
    verificationToken,
    verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  await newUser.save();

  generateTokenAndSetCookies(res, newUser._id);
  await sendVerificationEmail(newUser.email, verificationToken);

  return res.json(
    new apiResponse(
      201,
      { ...newUser._doc, password: undefined },
      "User created successfully"
    )
  );
});

export const verfiyController = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const user = await User.findOne({
    verificationToken: code,
    verificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "Your OTP is wrong or expired");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();

  return res.json(
    new apiResponse(
      200,
      { ...user._doc, password: undefined },
      "User verified successfully"
    )
  );
});

export const logoutController = asyncHandler(async (req, res) => {
  res.clearCookie("authToken");
  return res.json(new apiResponse(200, {}, "User logged out successfully"));
});

export const loginController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "No user with this email");
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect Password");
  }

  generateTokenAndSetCookies(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  return res.json(
    new apiResponse(
      200,
      { ...user._doc, password: undefined },
      "User logged in successfully"
    )
  );
});

export const forgotPasswordController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetPasswordToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordTokenExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000);

  user.resetPasswordToken = resetPasswordToken;
  user.resetPasswordTokenExpiry = resetPasswordTokenExpiry;

  await user.save();

  await sendForgotPasswordEmail(
    user.email,
    `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`
  );

  return res.json(
    new apiResponse(200, {}, "Reset Password link has been sent to your email")
  );
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, "User not found with this token");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;
  user.save({ validateBeforeSave: false });

  await sendResetSuccessEmail(user.email);

  return res.json(
    new apiResponse(
      200,
      { ...user._doc, password: undefined },
      "Password reset successfully"
    )
  );
});

export const checkAuth = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.json(new apiResponse(200, user, "User auth checked successfully"));
});
