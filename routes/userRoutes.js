import express from "express";
import { auth } from "../middleware/auth.js";
import {
  resendOTP,
  signin,
  signup,
  verifyOTP,
  saveUserForm,
  editProfile,
  getUserProfile,
} from "../controllers/userController.js";
import { getCommunityPostsAndEvents } from "../controllers/communityController.js";
import upload from "../helpers/multer.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);
userRouter.post("/user-form", saveUserForm);

userRouter.get("/getCommunity-Posts", auth, getCommunityPostsAndEvents);
userRouter.get("/profile", auth, getUserProfile);
userRouter.patch("/edit-profile", auth, upload.single("image"), editProfile);

export default userRouter;
