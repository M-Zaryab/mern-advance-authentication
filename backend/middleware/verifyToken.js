import { User } from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.authToken;
  console.log("token ", token);
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
    // throw new ApiError(401, "Unauthorized - no token provided");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      throw new ApiError(400, "Invalid authenticaition Token");
    }

    req.userId = decodedToken?.userId;
    const user = await User.findById({ _id: decodedToken?.userId });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in verifying Token ", error);
    return res.json(new apiResponse(500, {}, "Failed to verify token"));
  }
};
