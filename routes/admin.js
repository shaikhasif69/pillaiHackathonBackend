import express from "express";
import {
  getAllCommunitiesWithPosts,
  getAllCommunitiesWithUserDetails,
  getApprovedCommunitiesWithUserDetails,
  getFaculties,
  getStudents,
  getUsersWithRole,
} from "../controllers/dashboard/adminController.js";
const adminRouter = express.Router();

adminRouter.get("/getAllUsers", getUsersWithRole);
adminRouter.get("/getStudents", getStudents);
adminRouter.get("/getFaculty", getFaculties);
adminRouter.get("/communities", getAllCommunitiesWithUserDetails);
adminRouter.get("/communities/approved", getApprovedCommunitiesWithUserDetails);
adminRouter.get("/communities/posts", getAllCommunitiesWithPosts);

export default adminRouter;
