import express from "express";
import {
  forgotPasswordController,
  loginController,
  logoutController,
  signupController,
  verfiyController,
  resetPasswordController,
  checkAuth,
} from "../controller/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.route("/check-auth").get(verifyToken, checkAuth);

router.route("/signup").post(signupController);

router.route("/verify").post(verfiyController);

router.route("/login").post(loginController);

router.route("/logout").post(logoutController);

router.route("/forgot-password").post(forgotPasswordController);

router.route("/reset-password/:token").post(resetPasswordController);

export default router;
