import express from "express";
import { auth } from "../middleware/auth.js";
import {
  createCommunity,
  deleteCommunity,
  getPostsByCommunity,
  getTrendingTags,
  joinCommunity,
  listCommunities,
  updateCommunity,
} from "./../controllers/communityController.js";
import {
  deletePost,
  getUserFeed,
  updatePost,
  writePost,
} from "../controllers/postController.js";

const communityRouter = express.Router();
//  community Routes
communityRouter.post("/create-community", auth, createCommunity);
communityRouter.put("/update-community/:communityId", auth, updateCommunity);
communityRouter.delete("/delete-community/:communityId", auth, deleteCommunity);
communityRouter.post("/join-community", auth, joinCommunity);
communityRouter.get("/communityPost/:communityId", getPostsByCommunity);
communityRouter.delete("/deletePost", auth, deletePost); //ADMIN CAN DELETE USER POST tOOO
communityRouter.get("/getPosts", auth, getUserFeed);

// WRITE POST  CRUD  ROUTES
communityRouter.post("/createPost", auth, writePost);
communityRouter.put("/updatePost", auth, updatePost);
communityRouter.delete("/deletePost", auth, deletePost);

// SPECIFIC ROUTES
communityRouter.get("/list-communities", listCommunities);
communityRouter.get("/trendingTags", getTrendingTags);

export default communityRouter;
