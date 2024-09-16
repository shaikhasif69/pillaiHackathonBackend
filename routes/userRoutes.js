import express from "express";
import { auth } from "../middleware/auth.js";
import {
  resendOTP,
  signin,
  signup,
  userProfile,
  verifyOTP,
  saveUserForm
} from "../controllers/userController.js";
import { getCommunityPostsAndEvents } from "../controllers/communityController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post('/user-form', saveUserForm);

userRouter.get("/getCommunity-Posts", auth, getCommunityPostsAndEvents);
userRouter.get("/profile", auth, userProfile);


export default userRouter;
