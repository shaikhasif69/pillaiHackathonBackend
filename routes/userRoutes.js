import express from "express";
import { auth } from "../middleware/auth.js";
import { signin, signup, userProfile } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/signin", signin);
userRouter.get("/profile", auth, userProfile);

export default userRouter;
